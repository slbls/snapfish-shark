import urllib.request
import urllib.parse
import json
import os
import re
from http.client import HTTPSConnection
from urllib.error import HTTPError
from argparse import ArgumentParser
from win32_setctime import setctime
from datetime import datetime
from functools import partial
from tqdm import tqdm as std_tqdm
from enum import Enum

# Sourced from Django
# https://github.com/django/django/blob/master/django/utils/text.py#L222
def get_valid_filename(value):
    value = str(value).strip().replace(" ", "_")
    return re.sub(r"(?u)[^-\w.]", "", value)


authentication_connection = HTTPSConnection("www.snapfish.com")
asset_connection = HTTPSConnection("assets.snapfish.com")


def get_authentication_token(email, password):
    # submit=true and componentID=1395868004571 (URL parameters), and
    # "iwPreActions:" "submit" and "next": "https://www.snapfish.com/home"
    # (request headers) are all required outside of an email and password for
    # the login request to work. All login requests seem to use the same
    # component ID. Where said ID originates from and what exactly it
    # represents is a mystery for another day.
    authentication_connection.request(
        "POST",
        "/loginto?submit=true&componentID=1395868004571",
        urllib.parse.urlencode(
            {
                "iwPreActions": "submit",
                "next": "https://www.snapfish.com/home",
                "EmailAddress": email,
                "Password": password,
            }
        ).encode(),
        {"Content-Type": "application/x-www-form-urlencoded",},
    )

    response = authentication_connection.getresponse()

    # A response status other than 302 indicates the login did not contain the
    # necessary information to fetch an authentication token or that the request
    # was unsuccessful (due to invalid credentials, network error, etc.).
    if not response.status == 302:
        raise RuntimeError(
            f"""error connecting to Snapfish when fetching authentication token (HTTP {response.status} {response.reason})."""
        )

    # The authentication token is not returned in the response body. Rather, it
    # exists in a Set-Cookie response header containing a value starting with
    # "oa2=sf_v1a". Said value holds additional, URL encoded information
    # separated by semicolons, where the token is the first element. Valid
    # authentication tokens in Snapfish endpoints are prefixed with
    # "Oauth sf_v1a", so the token contained in the header value must have its
    # "oa2=sf_v1a" prefix replaced accordingly.
    token = None
    for key, value in response.headers.items():
        if key != "Set-Cookie" or not value.startswith("oa2=sf_v1a"):
            continue

        token = urllib.parse.unquote(
            value.split(";")[0].replace("oa2=sf_v1a", "OAuth sf_v1a")
        )

    return token


# Collection and album data is obtained via the below endpoint. Among
# other information, it contains a general overview of all photo containers,
# such as IDs, user-created names, and creation dates. At a minimum, the album
# IDs are needed to obtain a given album's photo information from the other
# endpoint.
def get_raw_collections(token):
    asset_connection.request(
        "GET",
        "/pict/v2/collection/monthIndex?limit=0&skip=0&projection=createDate,assetType,files,assetIdList,userTags,updateDate,systemTags",
        None,
        {"access_token": token},
    )

    response = asset_connection.getresponse()
    if not response.status == 200:
        raise RuntimeError(
            f"error connecting to Snapfish when fetching collection and album information (HTTP {response.status} {response.reason})."
        )

    return json.loads(response.read())["entityMap"]


# Per-album photo data is obtained via the below endpoint, including a link to
# every image's original resolution file on Snapfish servers.
def get_raw_photos(token, album_id):
    asset_connection.request(
        "GET",
        f"/pict/v2/collection/{album_id}/assets?assetType=PICTURE",
        None,
        {"access_token": token},
    )

    response = asset_connection.getresponse()
    if not response.status == 200:
        raise RuntimeError(
            f"error connecting to Snapfish when fetching photo information (HTTP {response.status} {response.reason})."
        )

    return json.loads(response.read())["entities"]


def get_asset_information(token):
    raw_collections = get_raw_collections(token)
    raw_collections_items = tqdm(raw_collections.items())
    raw_collections_items.set_description("Fetching asset information")

    collections = []
    for key, value in raw_collections_items:
        collection = {
            "name": key,
            "date": datetime.strptime(key, "%Y-%m").timestamp(),
            "albums": [],
        }

        raw_albums = value["collectionList"]
        for raw_album in raw_albums:
            album_name = raw_album["userTags"][0]["value"]
            album = {
                "id": raw_album["id"],
                "name": album_name,
                "date": raw_album["createDate"] / 1000,
                "directory_path": os.path.join(
                    collection["name"], get_valid_filename(album_name)
                ),
                "photos": [],
            }

            raw_photos = get_raw_photos(token, album["id"])
            for raw_photo in raw_photos:
                photo_id = raw_photo["id"]
                album["photos"].append(
                    {
                        "id": photo_id,
                        "link": raw_photo["files"][0]["url"],
                        "date": raw_photo["dateTaken"] / 1000
                        if raw_photo["dateTaken"]
                        else collection["date"],
                        "file_path": f"""{os.path.join(
                            album["directory_path"], str(photo_id)
                        )}.jpg""",
                    }
                )

            collection["albums"].append(album)

        collections.append(collection)

    return collections


def download_assets(token):
    collections = get_asset_information(token)

    for collection in collections:
        collection_name = collection["name"]
        albums = collection["albums"]
        albums_count = len(albums)
        print(f"""{collection_name} ({albums_count} albums)""")

        os.makedirs(collection_name, exist_ok=True)

        for i, album in enumerate(albums):
            os.makedirs(album["directory_path"], exist_ok=True)

            photos = tqdm(album["photos"])
            photos.set_description(f"""{album["name"]}""")

            for photo in photos:
                photo_file_path = photo["file_path"]

                try:
                    urllib.request.urlretrieve(
                        photo["link"], photo_file_path,
                    )
                except HTTPError:
                    pass

            if i == albums_count - 1:
                print("\n")


if __name__ == "__main__":
    parser = ArgumentParser(description="🦈 Bare-bones Snapfish photo downloader.")
    parser.add_argument(
        "-e", "--email", metavar="email", help="Snapfish email address.", required=True,
    )
    parser.add_argument(
        "-p", "--password", metavar="password", help="Snapfish password.", required=True
    )

    args = parser.parse_args()
    tqdm = partial(std_tqdm, dynamic_ncols=True)

    download_assets(get_authentication_token(args.email, args.password))

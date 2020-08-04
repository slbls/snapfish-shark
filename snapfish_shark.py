import urllib.request
import urllib.parse
import shutil
import json
import string
import os
import re
from http.client import HTTPSConnection
from urllib.error import HTTPError, URLError
from argparse import ArgumentParser
from functools import partial
from tqdm import tqdm as std_tqdm
from enum import Enum


# Sourced from Django
# https://github.com/django/django/blob/master/django/utils/text.py#L222
def get_valid_filename(value):
    valid_characters = frozenset("-_.() %s%s" % (string.ascii_letters, string.digits))
    return "".join(character for character in value if character in valid_characters)


def get_authentication_token(email, password):
    connection = HTTPSConnection("www.snapfish.com")
    # submit=true and componentID=1395868004571 (URL parameters), and
    # "iwPreActions:" "submit" and "next": "https://www.snapfish.com/home"
    # (request headers) are all required outside of an email and password for
    # the login request to work. All login requests seem to use the same
    # component ID. Where said ID originates from and what exactly it
    # represents is a mystery for another day.
    connection.request(
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

    response = connection.getresponse()

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
def get_collections(token):
    connection = HTTPSConnection("assets.snapfish.com")
    connection.request(
        "GET",
        "/pict/v2/collection/monthIndex?limit=0&skip=0&projection=createDate,assetType,files,assetIdList,userTags,updateDate,systemTags",
        None,
        {"access_token": token},
    )

    response = connection.getresponse()
    if not response.status == 200:
        raise RuntimeError(
            f"error connecting to Snapfish when fetching collection and album information (HTTP {response.status} {response.reason})."
        )

    return json.loads(response.read())["entityMap"]


# Album-specific photo data is obtained via the below endpoint, including a link to
# every image's original resolution file on Snapfish servers.
def get_photos(token, album_id):
    connection = HTTPSConnection("assets.snapfish.com")
    connection.request(
        "GET",
        f"/pict/v2/collection/{album_id}/assets?assetType=PICTURE",
        None,
        {"access_token": token},
    )

    response = connection.getresponse()
    if not response.status == 200:
        raise RuntimeError(
            f"error connecting to Snapfish when fetching photo information (HTTP {response.status} {response.reason})."
        )

    return json.loads(response.read())["entities"]


def download(token):
    collections = get_collections(token)

    for collection_name, collection in collections.items():
        # Albums are also referred to as collections by Snapfish, hence why
        # they are accessed through a "collectionList" property that exists on
        # each collection. For the sake of clarity, this project refers to a
        # year-month set of albums as a collection and an album as an album.
        albums = collection["collectionList"]
        albums_count = len(albums)

        print(f"""{collection_name} ({albums_count} albums)""")

        os.makedirs(collection_name, exist_ok=True)

        for i, album in enumerate(albums):
            album_name = album["userTags"][0]["value"]

            # Snapfish album names can contain invalid path characters, so
            # they must be normalized before being made into directories.
            album_directory = os.path.join(
                collection_name, get_valid_filename(album_name)
            )

            os.makedirs(
                album_directory, exist_ok=True,
            )

            photos = tqdm(get_photos(token, album["id"]))
            photos.set_description(album_name)

            failed_downloads = 0
            for photo in photos:
                photo_path = (
                    f"""{os.path.join(album_directory, str(photo["id"]))}.jpg"""
                )
                if os.path.isfile(photo_path):
                    continue

                photo_url = photo["files"][0]["url"]
                photo_url_domain_instance = urllib.parse.urlparse(
                    photo_url
                ).netloc.split(".sf-cdn.com")[0]
                download_attempts = 0

                while download_attempts != 5:
                    try:
                        # Photos have two files associated with them: a low-res file
                        # (used by Snapfish for thumbnails and quick previews) and
                        # a high-res file (the original, full size image).
                        with urllib.request.urlopen(
                            photo_url.replace(
                                photo_url_domain_instance,
                                (
                                    photo_url_domain_instance[:-1]
                                    if photo_url_domain_instance[-1:].isdigit()
                                    else photo_url_domain_instance
                                )
                                + (str(download_attempts) if download_attempts != 0 else ""),
                            )
                        ) as response, open(photo_path, "wb") as file:
                            shutil.copyfileobj(response, file)
                            break
                    except (HTTPError, URLError):
                        download_attempts += 1
                    except ConnectionResetError:
                        pass

                if download_attempts == 5:
                    failed_downloads += 1
                    photos.set_description(f"{album_name} ({failed_downloads} failed)")

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

    download(get_authentication_token(args.email, args.password))
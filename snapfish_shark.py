import urllib.request
import json
import os
import re
from unicodedata import normalize as unicode_normalize
from http.client import HTTPSConnection
from urllib.error import HTTPError
from argparse import ArgumentParser
from win32_setctime import setctime
from datetime import datetime
from functools import partial
from tqdm import tqdm as std_tqdm
from enum import Enum


def get_valid_filename(value):
    value = unicode_normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value.lower())
    return re.sub(r"[-\s]+", "-", value).strip("-_")


def set_file_timestamp(path, timestamp):
    setctime(path, timestamp)
    os.utime(path, (timestamp, timestamp))


token = None
connection = HTTPSConnection("assets.snapfish.com")


class SnapfishEndpoint(Enum):
    ASSET_INFORMATION = (
        "/pict/v2/collection/monthIndex?limit={}&skip=0&projection=assetIdList,userTags"
    )
    PHOTOS = "/pict/v2/collection/{}/assets?assetType=PICTURE"


def send_request(endpoint, *args):
    connection.request(
        "GET", endpoint.value.format(*args), None, {"access_token": token}
    )

    response = connection.getresponse()
    if not response.status == 200:
        raise RuntimeError(
            f"""error connecting to Snapfish when fetching {"collection and album information" if endpoint is SnapfishEndpoint.ASSET_INFORMATION else "photo information" } (HTTP {response.status} {response.reason})."""
        )

    return response


def get_raw_collections(limit=0):
    return json.loads(send_request(SnapfishEndpoint.ASSET_INFORMATION, limit).read())[
        "entityMap"
    ]


def get_raw_photos(album_id):
    return json.loads(send_request(SnapfishEndpoint.PHOTOS, album_id).read())[
        "entities"
    ]


def get_asset_information(collection_limit=0):
    raw_collections = get_raw_collections(collection_limit)
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
                "directory_path": os.path.join(
                    collection["name"], get_valid_filename(album_name)
                ),
                "photos": [],
            }

            raw_photos = get_raw_photos(album["id"])
            for raw_photo in raw_photos:
                photo_id = raw_photo["id"]
                album["photos"].append(
                    {
                        "id": photo_id,
                        "link": raw_photo["files"][0]["url"],
                        "file_path": f"""{os.path.join(
                            album["directory_path"], str(photo_id)
                        )}.jpg""",
                    }
                )

            collection["albums"].append(album)

        collections.append(collection)

    return collections


def download_assets(collection_limit=0):
    collections = get_asset_information()

    for collection in collections:
        collection_name = collection["name"]
        collection_date = collection["date"]
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
                if os.path.isfile(photo_file_path):
                    set_file_timestamp(photo_file_path, collection_date)
                    continue

                try:
                    urllib.request.urlretrieve(
                        photo["link"], photo_file_path,
                    )
                except HTTPError:
                    pass
                else:
                    set_file_timestamp(photo_file_path, collection_date)

            if i == albums_count - 1:
                print("\n")


if __name__ == "__main__":
    parser = ArgumentParser(description="Download Snapfish photos.")
    parser.add_argument(
        "-t",
        "--token",
        metavar="token",
        help="Snapfish authentication token.",
        required=True,
    )
    parser.add_argument(
        "-l",
        "--limit",
        metavar="limit",
        help="Sets the maximum number of collections to download.",
        default=0,
    )

    args = parser.parse_args()
    tqdm = partial(std_tqdm, dynamic_ncols=True)
    token = args.token

    download_assets(args.limit)

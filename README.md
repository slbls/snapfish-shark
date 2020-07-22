# snapfish-shark

🦈 Bare-bones Snapfish photo downloader.

## Usage

```
usage: snapfish_shark.py [-h] -t token

🦈 Bare-bones Snapfish photo downloader.

optional arguments:
  -h, --help            show this help message and exit
  -t token, --token token
                        Snapfish authentication token.
```

### Retrieving the Authentication Token

1. Extract the `access_token` from the Snapfish website (requires being logged
   in) by opening up the browser's devtools.
2. Navigate to the Network tab.
3. Find and select a JSON response.
4. Locate the response's `access_token` request header (the value should start
   with `OAuth sf_v1a;`).

### Terminology

| Term       | Definition                                                |
| ---------- | --------------------------------------------------------- |
| Collection | A set of albums from a given month in a given year.       |
| Album      | A named collection of photos. Exists inside a collection. |
| Photo      | A picture. Exists inside an album.                        |

### Output

All output goes to the current working directory (cwd) (which is wherever
snapfish-shark is being run). A folder will be created for each collection;
inside each collection a folder will be created for each album; inside each
album every image will be saved in JPG format.

```
cwd
    - 2020-01
        - family
            - 39297051.jpg
            - 82945731.jpg
            - 20989480.jpg
            - ...
        - friends
            - 10293810.jpg
            - ....
    - 2020-02
        - ...
        - ...
```

### Caveats

-   Because Snapfish album names can contain characters that are invalid in file
    paths, folders created for each album are named using a normalized version
    of the album name.

-   The authentication token may expire while snapchat-shark is running. If the
    program fails with "error connecting to Snapfish", obtain a new token using
    the same process as before.

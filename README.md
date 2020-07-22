# snapfish-shark

🦈 Bare-bones Snapfish photo downloader.

## Usage

```
usage: snapfish_shark.py [-h] -e email -p password

🦈 Bare-bones Snapfish photo downloader.

optional arguments:
  -h, --help            show this help message and exit
  -e email, --email email
                        Snapfish email address.
  -p password, --password password
                        Snapfish password.
```

### Terminology

| Term       | Definition                                           |
| ---------- | ---------------------------------------------------- |
| Collection | A set of albums from a given month in a given year.  |
| Album      | A named group of photos. Exists inside a collection. |
| Photo      | A picture. Exists inside an album.                   |

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

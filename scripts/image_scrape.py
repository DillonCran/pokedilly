import requests
import pip._vendor.requests
import os
from tqdm import tqdm
from bs4 import BeautifulSoup as bs
from urllib.parse import urljoin, urlparse


# check wheather URL is valid
def is_valid(url):
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)


# get all images from URL
def get_all_images(url):
    soup = bs(requests.get(url).content, "html.parser")
    urls = []
    for img in tqdm(soup.find_all("img"), "extracting images"):
        img_url = img.attrs.get("src")
        if not img_url:
            continue

        # Joining URL + img_url
        img_url = urljoin(url, img_url)

        # Remove URL GET parameters, URL fragments, etc.
        try:
            pos = img_url.index("?")
            img_url = img_url[:pos]
        except ValueError:
            pass

        # Confirms URL is valid
        if is_valid(img_url):
            urls.append(img_url)


# Image download
def img_download(url, pathname):
    # Makes path if no path dir
    if not os.path.isdir(pathname):
        os.makedirs(pathname)
    # Download image by chunk
    response = requests.get(url, stream=True)
    # Get total file size
    file_size = int(response.headers.get("Content-Length", 0))
    # Get file name
    filename = os.path.join(pathname, url.split("/")[-1])
    # Progress bar, unit = bytes
    progress = tqdm(
        response.iter_content(1024),
        f"Downloading {filename}",
        total=file_size,
        unit="B",
        unit_scale=True,
        unit_divisor=1024,
    )
    with open(filename, "wb") as f:
        for data in progress.iterable:
            f.write(data)
            # Update progress bar
            progress.update(len(data))


# exec function to download images
def main_download(url, path):
    imgs = get_all_images(url)
    for img in imgs:
        img_download(img, path)


# Actual URL for nowload
main_download("https://www.justinbasil.com/translations/sv3", "images")

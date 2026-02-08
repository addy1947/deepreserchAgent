import requests
from bs4 import BeautifulSoup

url = ""

headers = {
    "User-Agent": "Addy-Learning/1.0"
}

page = requests.get(url, headers=headers)

soup = BeautifulSoup(page.text, "html.parser")

print(soup.prettify()[:1200])   # show first part

# save full html
with open("wiki.html", "w", encoding="utf-8") as f:
    f.write(soup.prettify())

print("\nSaved as wiki.html")


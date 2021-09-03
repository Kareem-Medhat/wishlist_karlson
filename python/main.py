import requests
import yaml
from os.path import dirname
from bs4 import BeautifulSoup

def get_parent_dir(levels):
    curr = dirname(__file__)
    for _ in range(levels):
        curr = dirname(curr)
    return curr

parent_dir = get_parent_dir(1)

with open (parent_dir + "/config.yml", "r") as file:
  config = yaml.safe_load(file.read())

print(config.get("header"))

def number_string(num):
  abbrv = "th"
  unit = num % 10
  if num // 10 == 1:
    pass
  else:
    ranks = {
      "1": "st",
      "2": "nd",
      "3": "rd"
    }.get(str(unit))
    if ranks is not None:
      abbrv = ranks

  return "{}{}".format(num, abbrv)

steam_request = requests.get("https://store.steampowered.com/search/?filter=popularwishlist&ignore_preferences=1")

if steam_request is not None:
  steam_top_wishlist = steam_request.text
  html_parser = BeautifulSoup(steam_top_wishlist, "html.parser")
  results = html_parser.find(id="search_resultsRows")

  for (rank, game) in enumerate(results.find_all("a"), 1):
    name = game.find(class_="title").get_text()
    if name.lower() == "karlson":
      print(config.get("script").replace("%rank", number_string(rank)))
      break


import requests
from bs4 import BeautifulSoup
import yaml

with open ("../config.yml", "r") as file:
  config = yaml.safe_load(file.read())

print(config.get("header"))

def search_dict(iterable, func):
  for item in iterable:
    if func(item):
      return item
  return None
  
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
  ranked = []
  for (rank, game) in enumerate(results.find_all("a"), 1):
    name = game.find(class_="title").get_text()
    ranked.append({
      "rank": rank,
      "name": name
    })
  karlson = search_dict(ranked, lambda game: game.get("name").lower() == "karlson")

  print(config.get("script").replace("%rank", number_string(karlson.get("rank"))))

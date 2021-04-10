import axios from "axios";
import { JSDOM } from "jsdom";

function numberString(num) {
  let abbrv = "th";
  let unit = num % 10;
  if (Math.floor(num / 10) !== 1) {
    let ranks = {
      1: "st",
      2: "nd",
      3: "rd",
    };
    abbrv = ranks[num] || "th";
  }
  return `${num}${abbrv}`;
}

(async () => {
  console.log(`
░█░█░█▀█░█▀▄░█░░░█▀▀░█▀█░█▀█░░░▀█▀░█▀▀░░░▀█▀░█░█░█▀▀░░░█▀▄░█▀▀░█▀▀░▀█▀
░█▀▄░█▀█░█▀▄░█░░░▀▀█░█░█░█░█░░░░█░░▀▀█░░░░█░░█▀█░█▀▀░░░█▀▄░█▀▀░▀▀█░░█░
░▀░▀░▀░▀░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░░░▀▀▀░▀▀▀░░░░▀░░▀░▀░▀▀▀░░░▀▀░░▀▀▀░▀▀▀░░▀░	
	`);

  let request = await axios.get(
    "https://store.steampowered.com/search/?filter=popularwishlist&ignore_preferences=1"
  );
  let parser = new JSDOM(request.data).window.document;
  let results = parser.getElementById("search_resultsRows");
  let rank = 1;
  let ranked = [];
  for (let game of results.querySelectorAll(":scope > a")) {
    let name = game.querySelector(".title").textContent;
    ranked.push({
      name,
      rank,
    });
    rank++;
  }
  let karlson = ranked.find((game) => game.name.toLowerCase() === "karlson");
  console.log(
    `Haven't you heard of Karlson? It's only the ${numberString(
      karlson.rank
    )} most wishlisted game on steam. Wishlist it now so we can get to the number 1 spot GAMERS!`
  );
})();

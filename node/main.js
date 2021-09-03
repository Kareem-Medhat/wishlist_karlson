const axios = require("axios");
const yaml = require("js-yaml");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

let parentDir = path.resolve(__dirname, "..");
let rawYaml = fs.readFileSync(`${parentDir}/config.yml`);
let config = yaml.load(rawYaml);

console.log(config.header);

function numberString(num) {
  let abbrv = "th";
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
  let request = await axios.get(
    "https://store.steampowered.com/search/?filter=popularwishlist&ignore_preferences=1"
  );
  let parser = new JSDOM(request.data).window.document;
  let results = parser.querySelectorAll("#search_resultsRows > a");
  let rank = 1;
  
  for ( let game of results ) {
    let name = game.querySelector(".title").textContent;
    if (name.toLowerCase() === "karlson") {	
      console.log(config.script.replace("%rank", numberString(rank)));
      break;
    }
    rank++;
  }
})();

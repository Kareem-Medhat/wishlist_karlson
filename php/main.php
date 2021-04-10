<?php

echo "
░█░█░█▀█░█▀▄░█░░░█▀▀░█▀█░█▀█░░░▀█▀░█▀▀░░░▀█▀░█░█░█▀▀░░░█▀▄░█▀▀░█▀▀░▀█▀
░█▀▄░█▀█░█▀▄░█░░░▀▀█░█░█░█░█░░░░█░░▀▀█░░░░█░░█▀█░█▀▀░░░█▀▄░█▀▀░▀▀█░░█░
░▀░▀░▀░▀░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░░░▀▀▀░▀▀▀░░░░▀░░▀░▀░▀▀▀░░░▀▀░░▀▀▀░▀▀▀░░▀░	
";

// Require All Packages
require __DIR__  . "/vendor/autoload.php";
use voku\helper\HtmlDomParser;

function numberString(int $num) {
  $abbrv = 'th';
  $unit = $num % 10;
  if (floor($num / 10) !== 1) {
    /* switch ($unit) {
      case 1:
        $abbrv = 'st';
        break;
      case 2:
        $abbrv = 'nd';
        break;
      case 3:
        $abbrv = 'rd';
        break;
    } */
    $ranks = [1 => "st", 2 => "nd", 3 => "rd"];
    if (array_key_exists($unit, $ranks)) {
      $abbrv = $ranks[$unit];
    }
  }
  return "$num$abbrv";
}

$client = new \GuzzleHttp\Client();
$response = $client->request('GET', 'https://store.steampowered.com/search/?filter=popularwishlist&ignore_preferences=1');

if ($response->getStatusCode() === 200) {
  // Get response as text
  $html = $response->getBody()->getContents();

  // Parse the response text to html
  $dom = HtmlDomParser::str_get_html($html);

  // Get all entities for games
  $results = $dom->findMulti("#search_resultsRows a");

  $rank = 1;
  $ranked = [];

  foreach ($results as $game) {
    $title = $game->findOne(".title")->text();
    array_push($ranked, [
      "name" => $title,
      "rank" => $rank
    ]);
    $rank++;
  }

  $karlson =  current(array_filter($ranked, function($game) {
    return strtolower($game["name"]) === "karlson";
  }));
  
  
  printf("
Haven't you heard of Karlson? It's only the %s most wishlisted game on steam. Wishlist it now so we can get to the number 1 spot GAMERS!\n",
  numberString($karlson["rank"]));
}
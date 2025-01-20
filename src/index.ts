import { loginToTwitter } from "./utils/twitter/loginToTwitter";
import { Scraper } from "agent-twitter-client";

async function main() {
  const twitterClient = new Scraper();
  await loginToTwitter(twitterClient);

  console.log("Elo siema!");
}

main();

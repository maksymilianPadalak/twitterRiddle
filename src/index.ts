import { generateTextFromAi } from "./utils/ai/generateTextFromAi";
import { loginToTwitter } from "./utils/twitter/loginToTwitter";
import { postTweet } from "./utils/twitter/postTweet";
import { Scraper } from "agent-twitter-client";

async function main() {
  const twitterClient = new Scraper();
  await loginToTwitter(twitterClient);
  const newTweet = await generateTextFromAi(
    "What do you think about last formula1 season?"
  );

  if (newTweet) {
    await postTweet(twitterClient, newTweet);
  }
}

main();

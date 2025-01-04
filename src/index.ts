import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";
import { postTweet } from "./twitter/postTweet";
import { loginToTwitter } from "./twitter/loginToTwitter";
import { generateTweet } from "./ai/generateTweet";
import { getReplies } from "./twitter/getReplies";
import { getRiddleReplay } from "./ai/checkRiddleReplay";

dotenv.config();

const riddle = "What is the capital of France?";
const answer = "Paris";

async function main() {
  const newTweet = await generateTweet("Generate an unique riddle");
  console.log(newTweet);

  const twitterClient = new Scraper();

  await loginToTwitter(twitterClient);

  const ORIGINAL_RIDDLE_TWEET_ID = "1875557698546311386";
  const replies = await getReplies(twitterClient, ORIGINAL_RIDDLE_TWEET_ID);

  for await (const reply of replies) {
    if (!reply.text) {
      continue;
    }

    const isCorrect = await getRiddleReplay(riddle, answer, reply.text);

    const CORRECT_REPLY = "Correct! You are a genius!";
    const INCORRECT_REPLY = "Incorrect! Do you want a hint?";

    const agentReplayText = isCorrect ? CORRECT_REPLY : INCORRECT_REPLY;

    await postTweet(twitterClient, agentReplayText, reply.id);
  }
}

main();

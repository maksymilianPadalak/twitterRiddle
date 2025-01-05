import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";
import { postTweet } from "./utils/twitter/postTweet";
import { loginToTwitter } from "./utils/twitter/loginToTwitter";
import { generateTweet } from "./utils/ai/generateTweet";
import { getReplies } from "./utils/twitter/getReplies";
import { checkRiddleReplay } from "./utils/ai/checkRiddleReplay/checkRiddleReplay";
import { PrismaClient } from "@prisma/client";
import { getNewRiddle } from "./utils/getNewRiddle/getNewRiddle";
import { postRiddle } from "./utils/twitter/postRiddle";

dotenv.config();

const riddle = "What is the capital of Estonia?";
const answer = "Tallinn";

async function main() {
  const twitterClient = new Scraper();
  const prismaClient = new PrismaClient();

  await loginToTwitter(twitterClient);
  await postRiddle(twitterClient, prismaClient);

  //   const ORIGINAL_RIDDLE_TWEET_ID = "1875897383651074229";
  //   const replies = await getReplies(twitterClient, ORIGINAL_RIDDLE_TWEET_ID);

  //   for await (const reply of replies) {
  //     if (!reply.text) {
  //       continue;
  //     }

  //     const isCorrect = await checkRiddleReplay(riddle, answer, reply.text);

  //     const CORRECT_REPLY = "Correct! You are a genius!";
  //     const INCORRECT_REPLY = "Incorrect! Do you want a hint?";

  //     const agentReplayText = isCorrect ? CORRECT_REPLY : INCORRECT_REPLY;

  //     await postTweet(twitterClient, agentReplayText, reply.id);
  //   }
}

main();

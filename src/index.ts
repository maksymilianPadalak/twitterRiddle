import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";
import { loginToTwitter } from "./utils/twitter/loginToTwitter";
import { getReplies } from "./utils/twitter/getReplies";
import { PrismaClient } from "@prisma/client";
import { postRiddle } from "./utils/twitter/postRiddle";

dotenv.config();

async function main() {
  const twitterClient = new Scraper();
  const prismaClient = new PrismaClient();

  await loginToTwitter(twitterClient);
  const riddleId = await postRiddle(twitterClient, prismaClient);

  if (!riddleId) {
    console.error("Riddle ID not found. Program will exit.");
    return;
  }

  setInterval(async () => {
    const replies = await getReplies(twitterClient, riddleId);
    console.log("New riddle replies:", replies);
  }, 5000);

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

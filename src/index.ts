import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";
import { loginToTwitter } from "./utils/twitter/loginToTwitter";
import { getReplies } from "./utils/twitter/getReplies";
import { PrismaClient } from "@prisma/client";
import { postRiddle } from "./utils/twitter/postRiddle";
import { validateAnswer } from "./utils/validateAnswer";
import { postTweet } from "./utils/twitter/postTweet";
import { generateTextFromAi } from "./utils/ai/generateTextFromAi";

dotenv.config();

// TODO not working:
// - Fix bug with comparing the answer
// - Check for oldest answer!!!!
// - Find out if other people answers work as well

async function main() {
  const twitterClient = new Scraper();
  const prismaClient = new PrismaClient();

  await loginToTwitter(twitterClient);
  const currentRiddle = await postRiddle(twitterClient, prismaClient);

  if (!currentRiddle?.tweetId) {
    console.error("Current riddle tweet ID not found. Program will exit.");
    return;
  }

  const scaningForAnswerInterval = 5000;

  const intervalId = setInterval(async () => {
    console.log(
      `Scanning for answer with interval: ${scaningForAnswerInterval}ms...`
    );
    const replies = await getReplies(twitterClient, currentRiddle.tweetId!);
    for (const reply of replies) {
      if (!reply.text) {
        continue;
      }
      if (validateAnswer(currentRiddle.riddle.answer, reply.text)) {
        try {
          const winnerMessage = await generateTextFromAi(
            "Generate a cool message congratulating winner on answering the riddle correctly. Make it short and sweet."
          );
          await postTweet(twitterClient, winnerMessage, reply.id);
          console.log("WINNER FOUND");
          clearInterval(intervalId);
        } catch (error) {
          console.error("Error posting tweet:", error);
        }
      }
    }
  }, scaningForAnswerInterval);
}

main();

import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";
import { loginToTwitter } from "./utils/twitter/loginToTwitter";
import { getReplies } from "./utils/twitter/getReplies";
import { PrismaClient } from "@prisma/client";
import { postRiddle } from "./utils/twitter/postRiddle";
import { validateAnswer } from "./utils/validateAnswer";
import { postTweet } from "./utils/twitter/postTweet";
import { generateTextFromAi } from "./utils/ai/generateTextFromAi";
import { replyToWinningAnswer } from "./utils/twitter/replyToWinningAnswer";

dotenv.config();

// TODO not working:
// - Check for oldest answer!!!!
// -Retrvie tweet id many times

async function main() {
  const twitterClient = new Scraper();
  const prismaClient = new PrismaClient();

  await loginToTwitter(twitterClient);
  const currentRiddle = await postRiddle(twitterClient, prismaClient);

  if (!currentRiddle?.tweetId) {
    console.error("Current riddle tweet ID not found. Program will exit.");
    return;
  }

  const scaningForAnswerInterval = 30000;

  const intervalId = setInterval(async () => {
    console.log(
      `Scanning for answer with interval: ${scaningForAnswerInterval}ms`
    );
    const replies = await getReplies(twitterClient, currentRiddle.tweetId!);

    const sortedReplies = replies.sort((a, b) => {
      if (a?.timestamp && b?.timestamp) {
        return a.timestamp - b.timestamp;
      }
      return 0;
    });

    for (const reply of sortedReplies) {
      if (!reply.text || !reply.id) {
        continue;
      }

      const isAnswerCorrect = validateAnswer(
        currentRiddle.riddle.answer,
        reply.text
      );

      if (isAnswerCorrect) {
        replyToWinningAnswer(twitterClient, reply.id, intervalId);
        break;
      }
    }
  }, scaningForAnswerInterval);
}

main();

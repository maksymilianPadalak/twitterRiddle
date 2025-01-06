import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";
import { loginToTwitter } from "./utils/twitter/loginToTwitter";
import { getReplies } from "./utils/twitter/getReplies";
import { PrismaClient } from "@prisma/client";
import { postRiddle } from "./utils/twitter/postRiddle";
import { validateAnswer } from "./utils/validateAnswer";
import { replyToWinningAnswer } from "./utils/twitter/replyToWinningAnswer";
import { saveWinner } from "./utils/saveWinner";

dotenv.config();

// TODO not working:
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

  const scaningForAnswerInterval = 10000;

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
        console.error("Reply text or ID not found");
        continue;
      }

      const isAnswerCorrect = validateAnswer(
        currentRiddle.riddle.answer,
        reply.text
      );

      if (isAnswerCorrect) {
        await replyToWinningAnswer(twitterClient, reply.id, intervalId);

        if (reply.userId && reply.username) {
          await saveWinner(
            prismaClient,
            reply.id,
            reply.userId,
            reply.username
          );
          break;
        } else {
          console.error("User ID or username not found in reply");
        }
      }
    }
  }, scaningForAnswerInterval);
}

main();

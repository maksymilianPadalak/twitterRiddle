import { CronJob } from "cron";
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

// TODO
// -Check if user got logged out
// -Login less frequently

async function main() {
  let shouldStop = false;

  const timeout = setTimeout(() => {
    console.error("Main function exceeded 115 seconds. Stopping execution.");
    shouldStop = true;
  }, 115000);

  try {
    const twitterClient = new Scraper();
    const prismaClient = new PrismaClient();

    await loginToTwitter(twitterClient);
    const currentRiddle = await postRiddle(twitterClient, prismaClient);

    if (!currentRiddle?.tweetId) {
      console.error(
        "Current riddle tweet ID not found. Main function will exit."
      );
      return;
    }

    const scaningForAnswerInterval = 10000;

    const intervalId = setInterval(async () => {
      if (shouldStop) {
        clearInterval(intervalId);
        clearTimeout(timeout);
        console.log("Stopping interval and timeout. No winner found.");
        return;
      }

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
        if (shouldStop) {
          clearInterval(intervalId);
          clearTimeout(timeout);
          return;
        }

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
            clearInterval(intervalId);
            clearTimeout(timeout);
            return;
          } else {
            console.error("User ID or username not found in reply");
          }
        }
      }
    }, scaningForAnswerInterval);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const job = new CronJob("*/2 * * * *", () => {
  console.log("Running the main function every 2 minutes");
  main();
});

job.start();

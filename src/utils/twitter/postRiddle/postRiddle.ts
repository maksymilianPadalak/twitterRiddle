import { PrismaClient } from "@prisma/client";
import { Scraper } from "agent-twitter-client";
import { getUnsolvedRiddle } from "../../getNewRiddle";
import { getRiddleId } from "../getRiddleId";
import { postTweet } from "../postTweet";

export const postRiddle = async (
  twitterClient: Scraper,
  prismaClient: PrismaClient
) => {
  const postedRiddle = await getUnsolvedRiddle(prismaClient);
  if (!postedRiddle) {
    console.log("No not posted riddle found");
    return;
  }

  await postTweet(twitterClient, postedRiddle.riddle);

  try {
    await prismaClient.riddle.update({
      where: { id: postedRiddle.id },
      data: {
        isPosted: true,
      },
    });
    console.log(
      `Riddle with id: ${postedRiddle.id} marked as posted in the database.`
    );
  } catch (error) {
    console.error("Error updating riddle status:", error);
  }

  const retryCount = 10;
  for (let i = 1; i <= retryCount; i++) {
    console.log(
      `Attempting to retrieve riddle ID. Attempt: ${i}/${retryCount}`
    );
    try {
      const tweetId = await getRiddleId(twitterClient, postedRiddle.riddle);
      if (tweetId) {
        console.log(`Tweet ID successfully retrieved: ${tweetId}`);
        return { riddle: postedRiddle, tweetId };
      } else {
        console.log("No tweet ID found");
      }
    } catch (error) {
      console.error("Error getting riddle ID:", error);
    }
  }
};

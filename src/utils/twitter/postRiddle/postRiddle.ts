import { PrismaClient } from "@prisma/client";
import { Scraper } from "agent-twitter-client";
import { getUnsolvedRiddle } from "../../getNewRiddle";
import { getRiddleId } from "../getRiddleId";
import { postTweet } from "../postTweet";

export const postRiddle = async (
  twitterClient: Scraper,
  prismaClient: PrismaClient
) => {
  const unsolvedRiddle = await getUnsolvedRiddle(prismaClient);
  if (!unsolvedRiddle) {
    console.log("No unsolved riddle found");
    return;
  }

  await postTweet(twitterClient, unsolvedRiddle.riddle);

  try {
    await prismaClient.riddle.update({
      where: { id: unsolvedRiddle.id },
      data: {
        isPosted: true,
      },
    });
    console.log(
      `Riddle with id: ${unsolvedRiddle.id} marked as posted in the database.`
    );
  } catch (error) {
    console.error("Error updating riddle status:", error);
    throw error;
  }

  try {
    const tweetId = await getRiddleId(twitterClient, unsolvedRiddle.riddle);
    console.log(`Tweet ID successfully retrieved: ${tweetId}`);
    return { riddle: unsolvedRiddle, tweetId };
  } catch (error) {
    console.error("Error getting riddle ID:", error);
    throw error;
  }
};

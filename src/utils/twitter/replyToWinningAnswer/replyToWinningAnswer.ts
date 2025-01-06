import { Scraper, Tweet } from "agent-twitter-client";
import { postTweet } from "../postTweet";
import { generateTextFromAi } from "../../ai/generateTextFromAi";
import { saveWinner } from "../../saveWinner";

export const replyToWinningAnswer = async (
  twitterClient: Scraper,
  replyId: string,
  intervalId: NodeJS.Timeout
) => {
  try {
    const winnerMessage = await generateTextFromAi(
      "Generate a cool message congratulating winner on answering the riddle correctly. Make it short and sweet."
    );
    await postTweet(twitterClient, winnerMessage, replyId);
    console.log("WINNER FOUND");
    clearInterval(intervalId);
  } catch (error) {
    console.error("Error posting tweet:", error);
  }
};

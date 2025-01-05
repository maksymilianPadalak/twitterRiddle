import { Scraper } from "agent-twitter-client";

export const postTweet = async (
  client: Scraper,
  message: string,
  inReplyToTweetId?: string
) => {
  try {
    await client.sendTweet(message, inReplyToTweetId);
    console.log("Tweet posted successfully!");
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw error;
  }
};

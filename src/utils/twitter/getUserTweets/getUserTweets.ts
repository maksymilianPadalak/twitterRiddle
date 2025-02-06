import { Scraper } from "agent-twitter-client";

export const getUserTweets = async (
  twitterClient: Scraper,
  userId: string,
  maxTweets: number = 10
) => {
  const tweets = [];
  try {
    for await (const tweet of twitterClient.getTweetsByUserId(
      userId,
      maxTweets
    )) {
      tweets.push(tweet);
    }
    console.log("Tweets fetched successfully!");
  } catch (error) {
    console.error(error);
  }
  return tweets;
};

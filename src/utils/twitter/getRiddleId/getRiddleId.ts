import { Scraper, SearchMode } from "agent-twitter-client";

export const getRiddleId = async (
  twitterClient: Scraper,
  riddleText: string
) => {
  const searchQuery = `from:${process.env.TWITTER_USERNAME}`;

  try {
    const tweets = [];
    for await (const tweet of twitterClient.searchTweets(
      searchQuery,
      20,
      SearchMode.Latest
    )) {
      if (tweet.text === riddleText) {
        tweets.push(tweet);
      }
    }
    return tweets[0].id;
  } catch (error) {
    console.error("Error getting riddle ID:", error);
  }
};

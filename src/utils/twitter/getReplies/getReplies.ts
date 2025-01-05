import { Scraper } from "agent-twitter-client";

export const getReplies = async (
  twitterClient: Scraper,
  tweetId: string,
  searchLimit: number = 10
) => {
  const searchQuery = `to:${process.env.TWITTER_USERNAME}`;
  const replies = [];

  for await (const tweet of twitterClient.searchTweets(
    searchQuery,
    searchLimit
  )) {
    if (tweet.inReplyToStatusId === tweetId) {
      replies.push(tweet);
    }
  }

  return replies;
};

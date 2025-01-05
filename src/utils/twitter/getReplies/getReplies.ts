import { Scraper, SearchMode } from "agent-twitter-client";

export const getReplies = async (
  twitterClient: Scraper,
  tweetId: string,
  searchLimit: number = 10
) => {
  const searchQuery = `conversation_id:${tweetId} is:reply`;
  const replies = [];

  for await (const tweet of twitterClient.searchTweets(
    searchQuery,
    searchLimit
  )) {
    replies.push(tweet);
  }

  return replies;
};

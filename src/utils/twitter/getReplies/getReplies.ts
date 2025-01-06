import { Scraper } from "agent-twitter-client";

export const getReplies = async (
  twitterClient: Scraper,
  tweetId: string,
  searchLimit: number = 20
) => {
  const searchQuery = `conversation_id:${tweetId}`;
  const replies = [];

  for await (const tweet of twitterClient.searchTweets(
    searchQuery,
    searchLimit
  )) {
    if (tweet.inReplyToStatusId === tweetId) {
      replies.push(tweet);
    }
  }

  console.log("Number of replies found: ", replies.length);

  return replies;
};

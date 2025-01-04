import { Scraper } from "agent-twitter-client";

export const getReplies = async (
  twitterClient: Scraper,
  tweetId: string,
  timelineLimit: number = 10
) => {
  const timelineTweets = [];

  for await (const tweet of twitterClient.getTweets(
    process.env.TWITTER_USERNAME || "",
    timelineLimit
  )) {
    timelineTweets.push(tweet);
  }

  const replies = timelineTweets.filter(
    (tweet) => tweet.inReplyToStatusId === tweetId
  );

  return replies;
};

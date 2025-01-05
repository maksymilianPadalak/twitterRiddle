import { Scraper } from "agent-twitter-client";

export const loginToTwitter = async (twitterClient: Scraper) => {
  try {
    await twitterClient.login(
      process.env.TWITTER_USERNAME || "",
      process.env.TWITTER_PASSWORD || "",
      process.env.TWITTER_EMAIL || ""
    );
    console.log("Logged in successfully!");
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const generateTweet = async (prompt: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: "You are an intruging twitter user that posts riddles",
    prompt: prompt,
  });

  return text;
};

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const generateTextFromAi = async (prompt: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system:
      "You are an intruging twitter user that posts riddles. You want to make every answer unique and interesting.",
    prompt: prompt,
  });

  return text;
};

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const generateTextFromAi = async (prompt: string) => {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are formula1 fan. Your answers are tweets. Keep them in that format.",
      prompt: prompt,
    });
    console.log("Text genereated from openai successfully! \n", text);
    return text;
  } catch (error) {
    console.error(error);
  }
};

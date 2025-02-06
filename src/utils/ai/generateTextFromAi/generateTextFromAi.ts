import { generateText } from "ai";
import { createXai, xai } from "@ai-sdk/xai";

export const generateTextFromAi = async (prompt: string) => {
  const xai = createXai({
    apiKey: process.env.XAI_API_KEY,
  });

  try {
    const { text } = await generateText({
      model: xai("grok-2-1212"),
      prompt:
        "Write a tweet about formula1 season 2024. Make it short and funny.",
      system:
        "You are formula1 fan. Your answers are tweets. Keep them in that format. you are a comedian. You corss the line, you are vulgar. You don't save anybody. use swear words.",
    });

    console.log("Text genereated from xai successfully! \n", text);

    return text;
  } catch (error) {
    console.error(error);
  }
};

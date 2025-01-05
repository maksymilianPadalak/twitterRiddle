import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { INCORRECT_REPLY, CORRECT_REPLY } from "./constants";

//TODO Currently not used, but could be used in the future
export const checkRiddleReplay = async (
  riddle: string,
  correctAnswer: string,
  userAnswer: string
) => {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: "You are a judge that judges if an answer is correct or not",
    prompt: `This is the riddle: ${riddle} and this is the correct answer: ${correctAnswer}.
    Based on the answer, you should judge if the answer is correct or not.
    The answer is: ${userAnswer}. Does it match the correct answer? 
    Replay only with ${CORRECT_REPLY} or ${INCORRECT_REPLY}.`,
  });

  if (text === CORRECT_REPLY) {
    return true;
  }

  if (text === INCORRECT_REPLY) {
    return false;
  }

  throw new Error("Invalid reply");
};

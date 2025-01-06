export const validateAnswer = (answer: string, userAnswer: string) => {
  const regex = new RegExp(`\\b${answer}\\b`, "i");
  return regex.test(userAnswer);
};

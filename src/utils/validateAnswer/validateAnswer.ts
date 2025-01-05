export const validateAnswer = (answer: string, correctAnswer: string) => {
  return answer.toLowerCase().includes(correctAnswer.toLowerCase());
};

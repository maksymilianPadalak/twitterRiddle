import { PrismaClient } from "@prisma/client";

export const saveWinner = async (
  prismaClient: PrismaClient,
  riddleId: string,
  userId: string,
  username: string
) => {
  try {
    await prismaClient.winner.create({ data: { riddleId, userId, username } });
    console.log("Winner saved successfully");
  } catch (error) {
    console.error("Error saving winner:", error);
  }
};

import { PrismaClient } from "@prisma/client";

export const getNewRiddle = async (prismaClient: PrismaClient) => {
  try {
    const riddle = await prismaClient.riddle.findFirst({
      where: {
        isSolved: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return riddle;
  } catch (error) {
    console.error("Error fetching unsolved riddle:", error);
    throw error;
  }
};

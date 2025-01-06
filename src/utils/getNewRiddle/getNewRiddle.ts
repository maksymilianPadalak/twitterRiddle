import { PrismaClient } from "@prisma/client";

export const getNewRiddle = async (prismaClient: PrismaClient) => {
  try {
    const riddle = await prismaClient.riddle.findFirst({
      where: {
        isPosted: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return riddle;
  } catch (error) {
    console.error("Error fetching not posted riddle:", error);
    throw error;
  }
};

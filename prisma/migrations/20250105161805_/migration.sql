-- CreateTable
CREATE TABLE "Riddle" (
    "id" TEXT NOT NULL,
    "riddle" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Riddle_pkey" PRIMARY KEY ("id")
);

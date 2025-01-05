import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function importCSV(filePath: string) {
  const results: { answer: string; riddle: string }[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (const row of results) {
          await prisma.riddle.create({
            data: {
              answer: row.answer,
              riddle: row.riddle,
            },
          });
        }
        console.log("CSV data imported successfully!");
      } catch (error) {
        console.error("Error importing CSV data:", error);
      } finally {
        await prisma.$disconnect();
      }
    });
}

const filePath = process.argv[2];

if (!filePath) {
  console.error("Please provide the path to the CSV file as an argument.");
  process.exit(1);
}

importCSV(filePath);

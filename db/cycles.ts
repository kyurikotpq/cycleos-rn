import { db } from "./client";
import { cycles } from "./schema";

interface CreateCycleProps {
  startDate: number;
  startZoneOffset: number;
  endDate: number;
  endZoneOffset: number;
  periodLength?: number;
  cycleLength?: number;
}

export const insertCycle = async ({
  startDate,
  startZoneOffset,
  endDate,
  endZoneOffset,
  periodLength,
  cycleLength,
}: CreateCycleProps) =>
  await db.insert(cycles).values({
    startDate,
    startZoneOffset,
    endDate,
    endZoneOffset,
    periodLength,
    cycleLength,
  }).returning({ insertedId: cycles.id });

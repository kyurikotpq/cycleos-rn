import { db } from "./client";
import { cycle } from "./schema";

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
  await db.insert(cycle).values({
    startDate,
    startZoneOffset,
    endDate,
    endZoneOffset,
    periodLength,
    cycleLength,
  }).returning({ insertedId: cycle.id });


export const fetchCycles = async () => await db.select().from(cycle);

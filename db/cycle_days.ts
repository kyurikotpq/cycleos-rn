import { db } from "./client";
import { cycle_days } from "./schema";

interface CreateCycleDayProps {
  cycleId: number;
  dateId: string;
  zoneOffset: number;
  phase: string;
}

export const insertCycleDays = async (cycleDays: CreateCycleDayProps[]) =>
  await db.insert(cycle_days).values(cycleDays);

import { db } from "../client";
import { cycle_days } from "../schema";

interface CreateCycleDayProps {
  id: string;
  cycleId?: number;
  zoneOffset: number;
  phase: string;
}

export const insertCycleDays = async (cycleDays: CreateCycleDayProps[]) =>
  await db.insert(cycle_days).values(cycleDays);

export const insertCycleDayNoConflict = async (cycleDay: CreateCycleDayProps) =>
  await db.insert(cycle_days).values(cycleDay).onConflictDoNothing();

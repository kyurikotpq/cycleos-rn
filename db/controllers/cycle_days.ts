import { sql } from "drizzle-orm";
import { db } from "../client";
import { cycle_days } from "../schema";

export interface CreateCycleDayProps {
  id: string;
  cycleId?: number;
  zoneOffset: number;
  phase?: string;
}

export const upsertCycleDays = async (cycleDays: CreateCycleDayProps[]) =>
  await db
    .insert(cycle_days)
    .values(cycleDays)
    .onConflictDoUpdate({
      target: cycle_days.id,
      set: {
        cycleId: sql.raw(`excluded.${cycle_days.cycleId.name}`),
        phase: sql.raw(`excluded.${cycle_days.phase.name}`),
        zoneOffset: sql.raw(`excluded.${cycle_days.zoneOffset.name}`),
      },
    });

export const insertCycleDayConflictDoNothing = async (cycleDay: CreateCycleDayProps) =>
  await db.insert(cycle_days).values(cycleDay).onConflictDoNothing();

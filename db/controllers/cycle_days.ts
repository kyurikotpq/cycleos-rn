import { sql } from "drizzle-orm";
import { db } from "../client";
import { cycle_days } from "../schema";
import dayjs, { Dayjs } from "dayjs";

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

export const insertCycleDayConflictDoNothing = (
  cycleDay: CreateCycleDayProps
) => db.insert(cycle_days).values(cycleDay).onConflictDoNothing();

export const insertOrphanCycleDay = async (
  dayId: string,
  zoneOffset?: number
) => {
  // Set timezone if specified, else use local device timezone
  const dayJSObject = zoneOffset
    ? dayjs(dayId).utcOffset(zoneOffset)
    : dayjs(dayId);

  const cycleDay = {
    id: dayId,
    zoneOffset: dayJSObject.utcOffset(),
  };

  return insertCycleDayConflictDoNothing(cycleDay);
};

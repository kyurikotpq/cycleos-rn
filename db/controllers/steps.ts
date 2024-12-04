import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../client";
import { Step, steps } from "../schema.ts";
import { insertOrphanCycleDay } from "./cycle_days";
import { Dayjs } from "dayjs";

export const getStepsForDay = async (dayId: string) =>
  await db.select().from(steps).where(eq(steps.dayId, dayId));

export const upsertStepsForDay = async (stepObj: Step, startDayJS: Dayjs) => {
  await db.transaction(async (tx) => {
    // Ensure Cycle Day exists
    let cycleDayInsertResult = await insertOrphanCycleDay(
      stepObj.dayId,
      startDayJS.utcOffset()
    );

    // Upsert step count for day
    const _ = await db
      .insert(steps)
      .values(stepObj)
      .onConflictDoUpdate({
        target: steps.dayId,
        set: {
          steps: sql.raw(`excluded.${steps.steps.name}`),
        },
      });
  });
};

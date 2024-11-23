import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../client";
import { Step, steps } from "../schema";
import { insertCycleDayConflictDoNothing } from "./cycle_days";

export const upsertStepsForDay = async (stepObj: Step, zoneOffset: number) => {
  await db.transaction(async (tx) => {
    // Ensure Cycle Day exists
    const cycleDay = {
      id: stepObj.dayId,
      zoneOffset,
    };

    let cycleDayInsertResult = await insertCycleDayConflictDoNothing(cycleDay);

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

import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../client";
import { exercises } from "../schema";
import { insertCycleDayConflictDoNothing } from "./cycle_days";

export const insertExercise = async (exerciseObj: any, zoneOffset: number) => {
  await db.transaction(async (tx) => {
    // Ensure Cycle Day exists
    const cycleDay = {
      id: exerciseObj.dayId,
      zoneOffset,
    };

    let cycleDayInsertResult = await insertCycleDayConflictDoNothing(cycleDay);

    // Insert Exercise Record
    const _ = await db
      .insert(exercises)
      .values(exerciseObj)
      .onConflictDoNothing();
  });
};

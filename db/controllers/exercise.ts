import { db } from "../client";
import { exercises } from "../schema";
import { insertOrphanCycleDay } from "./cycle_days";
import { Dayjs } from "dayjs";

export const insertExercise = async (exerciseObj: any, zoneOffset: number) => {
  await db.transaction(async (tx) => {
    // Ensure Cycle Day exists
    let cycleDayInsertResult = await insertOrphanCycleDay(
      exerciseObj.dayId,
      zoneOffset
    );

    // Insert Exercise Record
    const _ = await db
      .insert(exercises)
      .values(exerciseObj)
      .onConflictDoNothing();
  });
};

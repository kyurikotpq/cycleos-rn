import { and, gt, desc, sql } from "drizzle-orm";
import { db } from "../client";
import { sleep_sessions, sleep_stages } from "../schema.ts";
import { insertOrphanCycleDay } from "./cycle_days";
import { Dayjs } from "dayjs";

const addSessionIdToStage = (sleepSessionId: number, stages: any[]) => {
  // Note: Stages should already be formatted by formatSleepSession in util/SleepSession.ts
  return stages.map((stage) => ({
    ...stage,
    sleepSessionId,
  }));
};

export const insertSleepSessionAndStages = async (
  sleepSessionToInsert: any,
  sleepStagesToInsert: any[],
  startDayJS: Dayjs
) => {
  await db.transaction(async (tx) => {
    // Ensure Cycle Day exists
    let cycleDayInsertResult = await insertOrphanCycleDay(
      sleepSessionToInsert.dayId,
      startDayJS.utcOffset()
    );

    // Insert Sleep Session
    // Since we're doing onConflictDoUpdate, an "inserted ID" will always be returned
    const insertedSleepSession = await db
      .insert(sleep_sessions)
      .values(sleepSessionToInsert)
      .returning({ insertedId: sleep_sessions.id })
      .onConflictDoUpdate({
        target: [sleep_sessions.dayId, sleep_sessions.startDateTime],
        set: {
          // Update the end time of the sleep session
          endDateTime: sql.raw(`excluded.${sleep_sessions.endDateTime.name}`),
          endZoneOffset: sql.raw(
            `excluded.${sleep_sessions.endZoneOffset.name}`
          ),
          duration: sql.raw(`excluded.${sleep_sessions.duration.name}`),
          totalAwake: sql.raw(`excluded.${sleep_sessions.totalAwake.name}`),
          totalRem: sql.raw(`excluded.${sleep_sessions.totalRem.name}`),
          totalLight: sql.raw(`excluded.${sleep_sessions.totalLight.name}`),
          totalDeep: sql.raw(`excluded.${sleep_sessions.totalDeep.name}`),
          remLatency: sql.raw(`excluded.${sleep_sessions.remLatency.name}`),
          fragmentationIndex: sql.raw(
            `excluded.${sleep_sessions.fragmentationIndex.name}`
          ),
        },
      });

    // Insert Sleep Stages
    const sleepStagesWithSessionId = addSessionIdToStage(
      insertedSleepSession[0].insertedId,
      sleepStagesToInsert
    );
    const _ = await db
      .insert(sleep_stages)
      .values(sleepStagesWithSessionId)
      .onConflictDoNothing();
  });
};

// Get the last sleep session that started after the specified time
export const getLastNightSleepSession = async (startTime: number) =>
  await db
    .select()
    .from(sleep_sessions)
    .where(
      and(
        gt(sleep_sessions.startDateTime, startTime),
        // Include sessions that have potential for > 2 sleep cycles
        gt(sleep_sessions.duration, 180)
      )
    )
    .orderBy(desc(sleep_sessions.startDateTime))
    .limit(1);

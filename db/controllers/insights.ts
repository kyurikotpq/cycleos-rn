import { and, eq, sql, like, notInArray, or, ne } from "drizzle-orm";
import { db } from "../client";
import {
  cycle_days,
  exercises,
  sleep_sessions,
  Step,
  steps,
  symptoms,
  symptoms_constructs,
} from "../schema";
import { NUM_MS_PER_MIN } from "@/constants/Time";

// Get Insights for Year
// The sleep calculation is WRONG! You can't group by dayId because people sleep after midnight.
// You'll need to use the startdatetime and check if it's within a specified range (maybe SQL has a way to to do this? UNIX (YYYY-MM-DD) < startdatetime xxx?)
export const getInsightsForYear = async (year: string) => {
  // Note: The string literal for LIKE is treated as a parameter, and therefore escaped
  // https://github.com/drizzle-team/drizzle-orm/discussions/2339
  return await db
    .select({
      dayId: cycle_days.id,
      phase: cycle_days.phase,

      // Total sleep duration per day (includes naps)
      sleepDuration: sql<number>`SUM(${sleep_sessions.duration})`,

      // % of sleep stage wrt to sleep duration per session, averaged across all sleep sessions per day
      avgAwake: sql`AVG(CAST(${sleep_sessions.totalAwake} AS REAL) / CAST(${sleep_sessions.duration} AS REAL) * 100)`,
      avgRem: sql`AVG(CAST(${sleep_sessions.totalRem} AS REAL) / CAST(${sleep_sessions.duration} AS REAL) * 100)`,
      avgDeep: sql`AVG(CAST(${sleep_sessions.totalDeep} AS REAL) / CAST(${sleep_sessions.duration} AS REAL) * 100)`,

      // REM latency = time to first reach REM stage after falling asleep
      // It will be averaged across all sleep sessions per day
      avgRemLatency: sql<number>`AVG(${sleep_sessions.remLatency})`,

      // Total exercise duration per day
      exerciseDuration: sql<number>`CAST(SUM(${exercises.endDateTime} - ${exercises.startDateTime}) AS REAL)/${NUM_MS_PER_MIN}`,
      steps: steps.steps,

      // Count number of unique non-ok symptoms
      symptoms: sql<number>`COUNT(DISTINCT(${symptoms.symptomId}))`,
    })
    .from(cycle_days)
    .leftJoin(sleep_sessions, eq(cycle_days.id, sleep_sessions.dayId))
    .leftJoin(steps, eq(cycle_days.id, steps.dayId))
    .leftJoin(exercises, eq(cycle_days.id, exercises.dayId))
    .leftJoin(symptoms, eq(cycle_days.id, symptoms.dayId))
    .leftJoin(
      symptoms_constructs,
      eq(symptoms.symptomId, symptoms_constructs.id)
    )
    .where(
      and(
        like(cycle_days.id, `${year}-%`),
        or(
          eq(db.$count(symptoms, eq(symptoms.dayId, cycle_days.id)), 0),
          ne(symptoms_constructs.label, "OK")
        )
      )
    )
    .groupBy(cycle_days.id);

  // console.log(query.toSQL());
  // return await ;
};

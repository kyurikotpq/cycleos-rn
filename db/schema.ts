import { SQL, sql } from "drizzle-orm";
import {
  integer,
  numeric,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/** Cycles */
/**
 * !!! THIS IS A DRIZZLE BUG! !!!
 * Using `export const cycles` (i.e. plural `cycles` spelling)
 * will cause the migrations to generate the CREATE TABLE
 * queries in the wrong order (i.e. `cycle_days` will be
 * created before `cycles`).
 * */
export const cycle = sqliteTable("cycles", {
  id: integer("id").primaryKey(),
  startDate: integer("start_date"),
  startZoneOffset: integer("start_zone_offset"),
  endDate: integer("end_date"),
  endZoneOffset: integer("start_zone_offset"),
  periodLength: integer("period_length"),
  cycleLength: integer("cycle_length"),
});

export type Cycle = typeof cycle.$inferSelect;
export type InsertCycle = typeof cycle.$inferInsert;

/** Cycle Days */
export const cycle_days = sqliteTable("cycle_days", {
  id: text("date_id").primaryKey(), // YYYY-MM-DD
  cycleId: integer("cycle_id").references(() => cycle.id, {
    onDelete: "set null",
  }),
  zoneOffset: integer("zone_offset").notNull(),
  phase: text("phase", { length: 20 }),
  notes: text("notes", { length: 255 }),
});

export type CycleDay = typeof cycle_days.$inferSelect;
export type InsertCycleDay = typeof cycle_days.$inferInsert;

/** SymptomsConstructs */
export const symptoms_constructs = sqliteTable(
  "symptoms_constructs",
  {
    id: integer("id").primaryKey().notNull(),
    type: text("type", { length: 20 }).notNull(), // menstruation, pain, mood, skin, energy
    label: text("label", { length: 50 }).notNull(),
  },
  (table) => ({
    constructUniqueIndex: uniqueIndex("constructUniqueIndex").on(
      sql`lower(${table.type})`,
      sql`lower(${table.label})`
    ),
  })
);

export type SymptomConstruct = typeof symptoms_constructs.$inferSelect;
export type InsertSymptomConstruct = typeof symptoms_constructs.$inferInsert;

/** Symptoms */
export const symptoms = sqliteTable(
  "symptoms",
  {
    dayId: text("day_id")
      .notNull()
      .references(() => cycle_days.id),
    symptomId: integer("symptom_id").references(() => symptoms_constructs.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.dayId, table.symptomId] }),
    };
  }
);

export type Symptom = typeof symptoms.$inferSelect;
export type InsertSymptom = typeof symptoms.$inferInsert;

/** Exercises */
export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey().notNull(),
  dayId: text("day_id")
    .notNull()
    .references(() => cycle_days.id),
  startDateTime: integer("start_datetime").notNull(),
  startZoneOffset: integer("start_zone_offset").notNull(),
  endDateTime: integer("end_datetime").notNull(),
  endZoneOffset: integer("end_zone_offset").notNull(),
  exerciseType: integer("exercise_type").notNull(),
  notes: text("notes", { length: 255 }),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

/** Steps */
export const steps = sqliteTable("steps", {
  dayId: text("day_id")
    .primaryKey()
    .notNull()
    .references(() => cycle_days.id),
  steps: integer("steps").notNull(),
});

export type Step = typeof steps.$inferSelect;
export type InsertStep = typeof steps.$inferInsert;

/** Sleep Sessions */
export const sleep_sessions = sqliteTable("sleep_sessions", {
  id: integer("id").primaryKey().notNull(),
  dayId: text("day_id")
    .notNull()
    .references(() => cycle_days.id),
  startDateTime: integer("start_datetime").notNull(),
  startZoneOffset: integer("start_zone_offset").notNull(),
  endDateTime: integer("end_datetime").notNull(),
  endZoneOffset: integer("end_zone_offset").notNull(),
  duration: numeric("duration").notNull(),
  totalAwake: numeric("total_awake").notNull(), // WASO
  totalRem: numeric("total_rem").notNull(),
  totalLight: numeric("total_light").notNull(),
  totalDeep: numeric("total_deep").notNull(),
  remLatency: numeric("rem_latency"),
  fragmentationIndex: numeric("fragmentation_index"), // Number of awakenings per hour of sleep
});

export type SleepSession = typeof sleep_sessions.$inferSelect;
export type InsertSleepSession = typeof sleep_sessions.$inferInsert;

/** Sleep Stages */
export const sleep_stages = sqliteTable("sleep_stages", {
  id: integer("id").primaryKey().notNull(),
  sleepSessionId: integer("sleep_session_id")
    .notNull()
    .references(() => sleep_sessions.id),
  startDateTime: integer("start_datetime").notNull(),
  startZoneOffset: integer("start_zone_offset").notNull(),
  endDateTime: integer("end_datetime").notNull(),
  endZoneOffset: integer("end_zone_offset").notNull(),
  sleepType: integer("sleep_type").notNull(),
});

export type SleepStage = typeof sleep_stages.$inferSelect;
export type InsertSleepStage = typeof sleep_stages.$inferInsert;

import { and, eq, inArray } from "drizzle-orm";
import { db } from "../client";
import { symptoms, symptoms_constructs } from "../schema";
import {
  CreateCycleDayProps,
  insertCycleDayConflictDoNothing,
} from "./cycle_days";

export const fetchSymptomsAtDate = async (date: string) =>
  await db
    .select({
      id: symptoms_constructs.id,
      type: symptoms_constructs.type,
      label: symptoms_constructs.label,
    })
    .from(symptoms)
    .innerJoin(
      symptoms_constructs,
      eq(symptoms_constructs.id, symptoms.symptomId)
    )
    .where(eq(symptoms.dayId, date));

export const insertSymptoms = async (symptomsToInsert: any[]) =>
  await db.insert(symptoms).values(symptomsToInsert).onConflictDoNothing();

export const deleteSymptoms = async (dayId: string, symptomIds: number[]) =>
  await db
    .delete(symptoms)
    .where(
      and(eq(symptoms.dayId, dayId), inArray(symptoms.symptomId, symptomIds))
    );

export const updateSymptomsTransaction = async (
  toInsert: any[],
  toDelete: number[],
  cycleDay: CreateCycleDayProps
) => {
  await db.transaction(async (tx) => {
    let cycleDayInsertResult = await insertCycleDayConflictDoNothing(cycleDay);

    if (toInsert.length > 0) {
      const _ = await insertSymptoms(toInsert);
    }
    if (toDelete.length > 0) {
      const _ = await deleteSymptoms(cycleDay.id, toDelete);
    }
  });
};
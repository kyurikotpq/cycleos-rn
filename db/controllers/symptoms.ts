import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../client";
import { symptoms, symptoms_constructs } from "../schema";
import {
  CreateCycleDayProps,
  insertCycleDayConflictDoNothing,
} from "./cycle_days";

// @TODO: I will need to account for the case where my watch was loose during the night and recorded my sleep in several different chunks. This means getting sleep duration in a specified time range and caring less about sleep duration. 
export const fetchEnergyAtDate = async (date: string) =>
  await db
    .select({
      id: symptoms_constructs.id,
      type: symptoms_constructs.type,
      label: symptoms_constructs.label,
      isNegative: symptoms_constructs.isNegative,
    })
    .from(symptoms)
    .innerJoin(
      symptoms_constructs,
      eq(symptoms_constructs.id, symptoms.symptomId)
    )
    .where(
      and(eq(symptoms.dayId, date), eq(symptoms_constructs.type, "energy"))
    )
    .orderBy(desc(symptoms.createdAt));

export const fetchSymptomsAtDate = async (date: string) =>
  await db
    .select({
      id: symptoms_constructs.id,
      type: symptoms_constructs.type,
      label: symptoms_constructs.label,
      isNegative: symptoms_constructs.isNegative,
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

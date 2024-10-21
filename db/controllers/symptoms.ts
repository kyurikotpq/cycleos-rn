import { eq, gt, lt, desc, sql, inArray } from "drizzle-orm";
import { db } from "../client";
import { symptoms, symptoms_constructs } from "../schema";
import { insertCycleDayNoConflict } from "./cycle_days";
import { getMostRecentCycle } from "./cycles";

export const fetchSymptomsAtDate = async (date: string) =>
  await db
    .select({
      id: symptoms.id,
      type: symptoms_constructs.type,
      label: symptoms_constructs.label,
    })
    .from(symptoms)
    .innerJoin(
      symptoms_constructs,
      eq(symptoms_constructs.id, symptoms.symptomId)
    )
    .where(eq(symptoms.dayId, date));

export const insertSymptoms = async (symptoms: any[]) =>
  await db.insert(symptoms).values(symptoms);

export const deleteSymptoms = async (symptomIds: number[]) =>
  await db.delete(symptoms).where(inArray(symptoms.id, symptomIds));

export const updateSymptomsTransaction = async (
  to_insert: any[],
  to_delete: number[],
  cycle_day: any
) => {
  await db.transaction(async (tx) => {
    const mostRecentCycle = await getMostRecentCycle();
    if (!mostRecentCycle) {
      throw new Error("No cycles found");
    }

    let cycleDayInsertResult = await insertCycleDayNoConflict(cycle_day);

    if (to_insert.length > 0) {
      const _ = await insertSymptoms(to_insert);
    }
    if (to_delete.length > 0) {
      const _ = await deleteSymptoms(to_delete);
    }
  });
};

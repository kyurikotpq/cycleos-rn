import { db } from "./client";
import { symptoms_constructs } from "./schema";
import { SYMPTOMS } from "@/constants/Symptoms";

export const seedSymptomsConstructs = async () =>
  await db.insert(symptoms_constructs).values(SYMPTOMS);

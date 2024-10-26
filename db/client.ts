import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

// don't export if not using studio
export const expoDb = openDatabaseSync("cycleos.db");

export const db = drizzle(expoDb);

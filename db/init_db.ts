import * as SQLite from "expo-sqlite";
import INIT_DB from "./cos_migration";

export const initDB = async () => {
  // Open the database connection
  const db = await SQLite.openDatabaseAsync("cycleos.db");

  // Create the tables
  await db.execAsync(INIT_DB.CREATE_CYCLES_TABLE_SQL);
  await db.execAsync(INIT_DB.CREATE_CYCLE_DAYS_TABLE_SQL);
  await db.execAsync(INIT_DB.CREATE_SYMPTOMS_TABLE_SQL);
  await db.execAsync(INIT_DB.CREATE_EXERCISE_TABLE_SQL);
  await db.execAsync(INIT_DB.CREATE_STEPS_TABLE_SQL);
  await db.execAsync(INIT_DB.CREATE_SLEEP_SESSIONS_TABLE_SQL);
  await db.execAsync(INIT_DB.CREATE_SLEEP_STAGES_TABLE_SQL);
};
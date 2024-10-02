import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./migrations/migrations";
import { db } from "./client";

export const initDB = async () => {
  await migrate(db, migrations);
  console.log("Database initialized");
};

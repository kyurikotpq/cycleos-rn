import * as SQLite from "expo-sqlite";

interface CreateCycleProps {
  start_date: string;
  start_zone_offset: number;
  end_date: string;
  end_zone_offset: number;
  period_length?: number;
  cycle_length?: number;
}

export const create = async ({
  start_date,
  start_zone_offset,
  end_date,
  end_zone_offset,
  period_length,
  cycle_length,
}: CreateCycleProps) => {
  // SQL
  const sql = `
    INSERT INTO cycles (start_date, start_zone_offset, end_date, end_zone_offset, period_length, cycle_length)
    VALUES ($start_date, $start_zone_offset, $end_date, $end_zone_offset, $period_length, $cycle_length)
  `;

  // Open the database connection
  const db = await SQLite.openDatabaseAsync("databaseName");

  // Execute the SQL statement
  const statement = await db.prepareAsync(sql);

  try {
    let result = await statement.executeAsync({
      $start_date: start_date,
      $start_zone_offset: start_zone_offset,
      $end_date: end_date,
      $end_zone_offset: end_zone_offset,
      $period_length: period_length,
      $cycle_length: cycle_length,
    });
    
    console.log("result:", result);
  } finally {
    await statement.finalizeAsync();
  }
};

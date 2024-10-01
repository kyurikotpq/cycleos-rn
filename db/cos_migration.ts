const createCycleDaysTable = `
CREATE TABLE IF NOT EXISTS \`cycle_days\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`cycle_id\` integer NOT NULL,
    \`date_id\` text NOT NULL,
    \`zone_offset\` integer NOT NULL,
    \`phase\` text(20),
    FOREIGN KEY (\`cycle_id\`) REFERENCES \`cycles\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`;

const createCyclesTable = `
CREATE TABLE IF NOT EXISTS \`cycles\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`start_date\` integer,
    \`start_zone_offset\` integer,
    \`end_date\` integer,
    \`period_length\` integer,
    \`cycle_length\` integer
);
`;

const createExercisesTable = `
CREATE TABLE IF NOT EXISTS \`exercises\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`day_id\` integer NOT NULL,
    \`start_datetime\` integer NOT NULL,
    \`start_zone_offset\` integer NOT NULL,
    \`end_datetime\` integer NOT NULL,
    \`end_zone_offset\` integer NOT NULL,
    \`exercise_type\` integer NOT NULL,
    \`notes\` text(255),
    FOREIGN KEY (\`day_id\`) REFERENCES \`cycle_days\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`;

const createSleepSessionsTable = `
CREATE TABLE IF NOT EXISTS \`sleep_sessions\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`day_id\` integer NOT NULL,
    \`start_datetime\` integer NOT NULL,
    \`start_zone_offset\` integer NOT NULL,
    \`end_datetime\` integer NOT NULL,
    \`end_zone_offset\` integer NOT NULL,
    \`duration\` numeric NOT NULL,
    \`total_awake\` numeric NOT NULL,
    \`total_rem\` numeric NOT NULL,
    \`total_light\` numeric NOT NULL,
    \`total_deep\` numeric NOT NULL,
    \`rem_latency\` numeric,
    \`WASO\` numeric,
    \`fragmentation_index\` integer,
    FOREIGN KEY (\`day_id\`) REFERENCES \`cycle_days\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`;

const createSleepStagesTable = `
CREATE TABLE IF NOT EXISTS \`sleep_stages\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`sleep_session_id\` integer NOT NULL,
    \`start_datetime\` integer NOT NULL,
    \`start_zone_offset\` integer NOT NULL,
    \`end_datetime\` integer NOT NULL,
    \`end_zone_offset\` integer NOT NULL,
    \`sleep_type\` integer NOT NULL,
    FOREIGN KEY (\`sleep_session_id\`) REFERENCES \`sleep_sessions\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`;

const createStepsTable = `
CREATE TABLE IF NOT EXISTS \`steps\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`day_id\` integer NOT NULL,
    \`steps\` integer NOT NULL,
    FOREIGN KEY (\`day_id\`) REFERENCES \`cycle_days\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`;

const createSymptomsTable = `
CREATE TABLE IF NOT EXISTS \`symptoms\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`day_id\` integer NOT NULL,
    \`type\` text(20) NOT NULL,
    \`construct_value\` integer,
    FOREIGN KEY (\`day_id\`) REFERENCES \`cycle_days\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`;

const INIT_DB = {
  CREATE_CYCLES_TABLE_SQL: createCyclesTable,
  CREATE_CYCLE_DAYS_TABLE_SQL: createCycleDaysTable,
  CREATE_EXERCISE_TABLE_SQL: createExercisesTable,
  CREATE_SLEEP_SESSIONS_TABLE_SQL: createSleepSessionsTable,
  CREATE_SLEEP_STAGES_TABLE_SQL: createSleepStagesTable,
  CREATE_STEPS_TABLE_SQL: createStepsTable,
  CREATE_SYMPTOMS_TABLE_SQL: createSymptomsTable,
};

export default INIT_DB;

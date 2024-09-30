const CREATE_CYCLES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS cycles (
    id INTEGER PRIMARY KEY NOT NULL,
    start_date DATE NOT NULL,
    start_zone_offset INTEGER NOT NULL,
    end_date DATE,
    end_zone_offset INTEGER,
    period_length INTEGER,
    cycle_length INTEGER
  );
`;

const CREATE_DAYS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS cycle_days (
    id INTEGER PRIMARY KEY NOT NULL,
    cycle_id INTEGER NOT NULL,
    date_id DATE NOT NULL,
    zone_offset INTEGER NOT NULL,
    phase VARCHAR(20) NOT NULL,
    FOREIGN KEY (cycle_id) REFERENCES cycles (id)
  );
`;

const CREATE_SYMPTOMS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS symptoms (
        id INTEGER PRIMARY KEY NOT NULL,
        day_id INTEGER NOT NULL,
        menstruation TEXT,
        pain TEXT,
        mood TEXT,
        skin TEXT,
        energy TEXT,
        FOREIGN KEY (day_id) REFERENCES cycle_days (id)
    );
`;

const CREATE_EXERCISE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY NOT NULL,
    day_id INTEGER NOT NULL,

    start_datetime DATETIME NOT NULL,
    start_zone_offset INTEGER NOT NULL,

    end_datetime DATETIME NOT NULL,
    end_zone_offset INTEGER NOT NULL,

    exercise_type INTEGER NOT NULL,
    notes VARCHAR(255),

    FOREIGN KEY (day_id) REFERENCES cycle_days (id)
  );
`;

const CREATE_STEPS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS steps (
    id INTEGER PRIMARY KEY NOT NULL,
    day_id INTEGER NOT NULL,

    steps INTEGER NOT NULL,

    FOREIGN KEY (day_id) REFERENCES cycle_days (id)
  );
`;

const CREATE_SLEEP_SESSIONS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS sleep_sessions (
    id INTEGER PRIMARY KEY NOT NULL,
    day_id INTEGER NOT NULL,

    start_datetime DATETIME NOT NULL,
    start_zone_offset INTEGER NOT NULL,

    end_datetime DATETIME NOT NULL,
    end_zone_offset INTEGER NOT NULL,

    duration FLOAT NOT NULL,
    total_awake FLOAT NOT NULL,
    total_rem FLOAT NOT NULL,
    total_light FLOAT NOT NULL,
    total_deep FLOAT NOT NULL,

    rem_latency FLOAT,
    WASO FLOAT, -- the total number of minutes awake after initial sleep onset
    fragmentation_index INTEGER, -- Number of awakenings per hour of sleep
  
    FOREIGN KEY (day_id) REFERENCES cycle_days (id)
  );
`;

const CREATE_SLEEP_STAGES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS sleep_stages (
    id INTEGER PRIMARY KEY NOT NULL,
    sleep_session_id INTEGER NOT NULL,

    start_datetime DATETIME NOT NULL,
    start_zone_offset INTEGER NOT NULL,

    end_datetime DATETIME NOT NULL,
    end_zone_offset INTEGER NOT NULL,

    sleep_type INTEGER NOT NULL,

    FOREIGN KEY (sleep_session_id) REFERENCES sleep_sessions (id)
  );
`;

const INIT_DB = {
  CREATE_CYCLES_TABLE_SQL,
  CREATE_DAYS_TABLE_SQL,
  CREATE_SYMPTOMS_TABLE_SQL,
  CREATE_EXERCISE_TABLE_SQL,
  CREATE_STEPS_TABLE_SQL,
  CREATE_SLEEP_SESSIONS_TABLE_SQL,
  CREATE_SLEEP_STAGES_TABLE_SQL,
};

export default INIT_DB;
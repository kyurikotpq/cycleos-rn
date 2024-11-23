import dayjs, { Dayjs } from "dayjs";
import { readRecords } from "react-native-health-connect";
import * as SecureStore from "expo-secure-store";
import { insertSleepSessionAndStages } from "@/db/controllers/sleep";
import { formatSleepSession } from "@/util/SleepSession";
import { upsertStepsForDay } from "@/db/controllers/steps";
import { insertExercise } from "@/db/controllers/exercise";

class HealthConnectService {
  private static instance: HealthConnectService;
  private HC_TYPES = ["SleepSession", "Steps", "ExerciseSession"];

  private constructor() {}

  static getInstance(): HealthConnectService {
    if (!HealthConnectService.instance) {
      HealthConnectService.instance = new HealthConnectService();
    }
    return HealthConnectService.instance;
  }

  async readHealthRecordsForType(
    type: "SleepSession" | "Steps" | "ExerciseSession",
    startTime: Dayjs,
    endDayJS: Dayjs
  ) {
    const result = await readRecords(type, {
      timeRangeFilter: {
        operator: "between",
        startTime: startTime.toISOString(),
        endTime: endDayJS.toISOString(),
      },
    });

    return result;
  }

  async saveHealthRecord(type: string, records: any[]) {
    const todayZoneOffset = -1 * new Date().getTimezoneOffset();

    // Save the health record to the SQLite database, depending on the type
    switch (type) {
      case "SleepSession":
        records.forEach(async (record) => {
          const { session, stages } = formatSleepSession(
            record,
            todayZoneOffset
          );

          await insertSleepSessionAndStages(session, stages);
        });
        break;
      case "Steps":
        records.forEach(async (record) => {
          // Assumed timezone: User's local timezone
          const formattedRecord = {
            dayId: dayjs(record.startTime).format("YYYY-MM-DD"),
            steps: record.count,
          };

          await upsertStepsForDay(formattedRecord, todayZoneOffset);
        });
        break;
      case "ExerciseSession":
        records.forEach(async (record) => {
          // react-native-health-connect returns ZoneOffset in SECONDS
          // So convert it to minutes
          const startZoneOffset = record.startZoneOffset.totalSeconds / 60;
          const endZoneOffset = record.endZoneOffset.totalSeconds / 60;

          const startDayJS = dayjs(record.startTime);

          const exerciseSession = {
            dayId: startDayJS.format("YYYY-MM-DD"),
            startDateTime: startDayJS.valueOf(),
            startZoneOffset,
            endDateTime: dayjs(record.endTime).valueOf(),
            endZoneOffset,
            exerciseType: record.exerciseType,
          };

          // Save the exercise record to the SQLite database
          await insertExercise(exerciseSession, startZoneOffset);
        });
        break;
    }
  }

  async checkRetrievalTime(type: string, todayDayJS: Dayjs) {
    const key = `last${type}RetrievalTime`;
    let lastKnownRetrievalTime = await SecureStore.getItemAsync(key);

    return !lastKnownRetrievalTime
      ? todayDayJS.startOf("day").subtract(120, "days")
      : dayjs(parseInt(lastKnownRetrievalTime));
  }

  async updateLastRetrievalTime(type: string) {
    const key = `last${type}RetrievalTime`;
    const _ = await SecureStore.setItemAsync(key, `${dayjs().valueOf()}`);
    return true;
  }

  async fetchAndSaveData(
    type: "SleepSession" | "Steps" | "ExerciseSession",
    todayDayJS: Dayjs
  ) {
    const lastRetrievalTime = await this.checkRetrievalTime(type, todayDayJS);
    const { records } = await this.readHealthRecordsForType(
      type,
      lastRetrievalTime,
      todayDayJS.endOf("day")
    );
    this.saveHealthRecord(type, records);
  }

  async syncAll(todayDayJS: Dayjs) {
    const results = await Promise.allSettled(
      (this.HC_TYPES as ("SleepSession" | "Steps" | "ExerciseSession")[]).map(
        (type) => this.fetchAndSaveData(type, todayDayJS)
      )
    );

    // Check if the data was successfully fetched and saved
    let status: any = {};
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        this.updateLastRetrievalTime(this.HC_TYPES[index]);
      }
      status[this.HC_TYPES[index]] = result.status === "fulfilled";
    });

    return status;
  }
}

export default HealthConnectService.getInstance();

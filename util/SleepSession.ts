import dayjs, { Dayjs } from "dayjs";

/**
 * https://developers.google.com/fit/scenarios/read-sleep-data
 *
 * Awake (during sleep cycle)	1
 * Sleep	2
 * Out-of-bed	3
 * Light sleep	4
 * Deep sleep	5
 * REM	6
 */

const tallyAndFormatSleepStages = (sessionStartTime: Dayjs, stages: any[]) => {
  let totalAwake = 0;
  let totalRem = 0;
  let totalLight = 0;
  let totalDeep = 0;
  let remLatency = null;
  let numArousals = 0;
  let numImmobileLongEpochs = 0;
  let firstRemStageFound = false;
  let formattedSleepStages: any[] = [];

  stages.forEach((stageObj: any) => {
    const startTimeDayJS = dayjs(stageObj.startTime);
    const endTimeDayJS = dayjs(stageObj.endTime);

    const durationMinutes = endTimeDayJS.diff(startTimeDayJS, "minutes");

    switch (stageObj.stage) {
      // Awake
      case 1:
        totalAwake += durationMinutes;
        if (durationMinutes * 60 >= 120) {
          numArousals++;
        }
        break;

      // Light Sleep
      case 4:
        totalLight += durationMinutes;
        if (durationMinutes < 1) {
          numArousals++;
        } else if (durationMinutes > 1) {
          numImmobileLongEpochs++;
        }
        break;

      // Deep Sleep
      case 5:
        totalDeep += durationMinutes;
        if (durationMinutes < 1) {
          numArousals++;
        } else if (durationMinutes > 1) {
          numImmobileLongEpochs++;
        }
        break;

      // REM Sleep
      case 6:
        totalRem += durationMinutes;
        if (!firstRemStageFound && durationMinutes > 1) {
          remLatency = startTimeDayJS.diff(sessionStartTime, "minutes");
          firstRemStageFound = true;
        }
        if (durationMinutes < 1) {
          numArousals++;
        } else if (durationMinutes > 1) {
          numImmobileLongEpochs++;
        }
        break;

      default:
        console.warn(`Unknown sleep stage: ${stageObj.stage}`);
        break;
    }

    formattedSleepStages.push({
      sleepType: stageObj.stage,
      startDateTime: startTimeDayJS.valueOf(),
      startZoneOffset: startTimeDayJS.utcOffset(),
      endDateTime: endTimeDayJS.valueOf(),
      endZoneOffset: endTimeDayJS.utcOffset(),
    });
  });

  /**
   * Note: Since wearables are NOT research-grade actigraphy, the fragmentation
   * index should not be interpreted as a clinical-/research-grade measure.
   *
   * The calculation used is based on Mezick et al. (2009):
   *     Number of arousals or awakenings = number of mobile epochs lasting four epochs + number of immobile epochs < 1 minute duration
   *
   *    (Number of arousals or awakenings / Number of immobile epochs > 1 minute duration) × 100
   *
   * ^ A very huge assumption in the above calculation is that non-awake stages are immobile, which is not always the case.
   *
   * The American Academy of Sleep Medicine (AASM) standardizes the length of an epoch at 30 seconds.
   */
  const fragmentationIndex = (numArousals / numImmobileLongEpochs) * 100;

  return {
    totalAwake,
    totalRem,
    totalLight,
    totalDeep,
    remLatency,
    fragmentationIndex,
    formattedSleepStages,
  };
};

/**
 * Format a HealthConnect SleepSession object for DB
 * IMPORTANT NOTE: `react-native-health-connect` currently does not attach timezone information to the sleep session and sleep stage data. The local device timezone is used, even for retrospective data. This needs to change when the package updates in future.
 *
 * @param session
 * @returns {
 *   session: SleepSession object (without database ID),
 *   stages: SleepStages[] (without database and SleepSession ID)
 * }
 */
export const formatSleepSession = (session: any) => {
  const sessionStartTimeDayJS = dayjs(session.startTime);
  const sessionEndTimeDayJS = dayjs(session.endTime);

  const {
    totalAwake,
    totalRem,
    totalLight,
    totalDeep,
    remLatency,
    fragmentationIndex,
    formattedSleepStages,
  } = tallyAndFormatSleepStages(sessionStartTimeDayJS, session.stages);

  // 4 hours maximum for a session to be considered a nap
  const isNap =
    sessionEndTimeDayJS.diff(sessionStartTimeDayJS, "minutes") <= 4 * 60;

  // Whether the sleep session *starts* between 6am and 7pm local time
  const isDaytime =
    sessionStartTimeDayJS.hour() >= 6 && sessionStartTimeDayJS.hour() < 19;

  // dayId should reflect the day the sleep session was *intended* for
  const startISO = sessionStartTimeDayJS.format("YYYY-MM-DD");
  const endISO = sessionEndTimeDayJS.format("YYYY-MM-DD");
  let dayId = endISO;

  // Note: For the sleep records of daylight savings end day (e.g. Nov 3, 2024), it exists in Samsung Health, but not in HealthConnect.
  if (
    endISO == startISO &&
    !isDaytime &&
    sessionEndTimeDayJS.hour() >= 19 &&
    sessionEndTimeDayJS.hour() < 24
  ) {
    // E.g. If you slept at 10pm Tues night but awoke at 11pm Tues night (<4h -> isNap = true; start and end day are the same, and it's not daytime), you likely intended to sleep through the night. So include the session as part of the next day's (e.g. Wed night's) sleep total
    dayId = sessionStartTimeDayJS.add(1, "day").format("YYYY-MM-DD");

    // Note: We don't have change dayId for sessions starting/ending 12am - 6am
    // because the default is to use the endISO, which in this case would be correct
  }

  const formattedSleepSession = {
    dayId,
    startDateTime: sessionStartTimeDayJS.valueOf(),
    startZoneOffset: sessionStartTimeDayJS.utcOffset(),
    endDateTime: sessionEndTimeDayJS.valueOf(),
    endZoneOffset: sessionEndTimeDayJS.utcOffset(),
    isNap,
    isDaytime,
    duration: sessionEndTimeDayJS.diff(sessionStartTimeDayJS, "minutes"),
    totalAwake,
    totalRem,
    totalLight,
    totalDeep,
    remLatency,
    fragmentationIndex,
  };

  return { session: formattedSleepSession, stages: formattedSleepStages };
};

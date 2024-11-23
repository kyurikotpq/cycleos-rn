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

const tallyAndFormatSleepStages = (
  sessionStartTime: Dayjs,
  todayZoneOffset: number,
  stages: any[]
) => {
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
        if (!firstRemStageFound) {
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
      startZoneOffset: todayZoneOffset,
      endDateTime: endTimeDayJS.valueOf(),
      endZoneOffset: todayZoneOffset,
    });
  });

  /**
   * Note: Since wearables are NOT research-grade actigraphy, the fragmentation
   * index should not be interpreted as a clinical-/research-grade measure.
   *
   * Calculation based on Mezick et al. (2009):
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
 * IMPORTANT NOTE: `react-native-health-connect` currently does not attach timezone information to the sleep session and sleep stage data. The local device timezone is used. This needs to change when the package updates in future.
 * 
 * @param session 
 * @param todayZoneOffset 
 * @returns {
 *   session: SleepSession object (without database ID), 
 *   stages: SleepStages[] (without database and SleepSession ID) 
 * }
 */
export const formatSleepSession = (session: any, todayZoneOffset: number) => {
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
  } = tallyAndFormatSleepStages(
    sessionStartTimeDayJS,
    todayZoneOffset,
    session.stages
  );

  const formattedSleepSession = {
    dayId: sessionStartTimeDayJS.format("YYYY-MM-DD"),
    startDateTime: sessionStartTimeDayJS.valueOf(),
    startZoneOffset: todayZoneOffset,
    endDateTime: sessionEndTimeDayJS.valueOf(),
    endZoneOffset: todayZoneOffset,
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

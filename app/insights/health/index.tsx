import { useEffect, useState, useMemo } from "react";
import * as SecureStore from "expo-secure-store";
import { Card } from "react-native-paper";

import StepsCard from "@/components/cards/StepsCard";
import SleepCard from "@/components/cards/SleepCard";
import { getLastNightSleepSession } from "@/db/controllers/sleep";
import dayjs, { Dayjs } from "dayjs";
import { fetchEnergyAtDate } from "@/db/controllers/symptoms";
import { getStepsForDay } from "@/db/controllers/steps";

export default function HealthInsightsScreen() {
  const todayDayJS = useMemo(() => dayjs(), []);

  // Summary Statistics for Sleep Data
  const [TODAY_SLEEP_SCORE, setTodaySleepScore] = useState("");
  const [TODAY_SLEEP_DURATION, setTodaySleepDuration] = useState(0);
  const [TODAY_SLEEP_TIME, setTodaySleepTime] = useState<Dayjs | null>(null);
  const [TODAY_SLEEP_WAKEUP, setTodayWakeup] = useState<Dayjs | null>(null);

  // Summary Statistics for Steps Data
  const [TARGET_STEPS, setTargetSteps] = useState(1);
  const [TODAY_STEPS, setTodaySteps] = useState(0);
  
  const getSleepData = async () => {
    // Get last night's sleep data
    const sleepResult = await getLastNightSleepSession(
      todayDayJS.startOf("day").subtract(5, "hours").valueOf()
    );

    if (sleepResult.length > 0) {
      const sleepSession = sleepResult[0];
      setTodaySleepDuration(sleepSession.duration);
      setTodaySleepTime(dayjs(sleepSession.startDateTime));
      setTodayWakeup(dayjs(sleepSession.endDateTime));
    }

    // Get self-reported energy data
    const energyResult = await fetchEnergyAtDate(
      todayDayJS.format("YYYY-MM-DD")
    );
    if (energyResult.length > 0) {
      setTodaySleepScore(energyResult[0].label);
    }
  };

  const getStepsData = async () => {
    const stepsResult = await getStepsForDay(todayDayJS.format("YYYY-MM-DD"));
    if (stepsResult.length > 0) {
      setTodaySteps(stepsResult[0].steps);
    }
  };
  const getData = async () => {
    const targetStepsResult = await SecureStore.getItemAsync("targetSteps");
    setTargetSteps(JSON.parse(targetStepsResult || "6000"));

    await getSleepData();
    await getStepsData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <SleepCard
        score={TODAY_SLEEP_SCORE}
        duration={TODAY_SLEEP_DURATION}
        sleepTime={TODAY_SLEEP_TIME}
        wakeUpTime={TODAY_SLEEP_WAKEUP}
      />

      <StepsCard todaySteps={TODAY_STEPS} targetSteps={TARGET_STEPS} />

      <Card mode="elevated" style={{ marginBottom: 20 }}>
        <Card.Title title="Workouts" subtitle="Workouts this week" />
      </Card>
    </>
  );
}

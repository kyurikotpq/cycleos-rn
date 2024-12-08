import { useEffect, useState, useMemo } from "react";
import * as SecureStore from "expo-secure-store";
import { Button, Card, Surface, Text } from "react-native-paper";

import StepsCard from "@/components/cards/StepsCard";
import SleepCard from "@/components/cards/SleepCard";
import { getLastNightSleepStats } from "@/db/controllers/sleep";
import dayjs, { Dayjs } from "dayjs";
import { fetchEnergyAtDate } from "@/db/controllers/symptoms";
import { getStepsForDay } from "@/db/controllers/steps";
import WorkoutsCard from "@/components/cards/WorkoutsCard";
import { MorningDailyQuotes } from "@/constants/Quotes";
import { ThemedText } from "@/components/ThemedText";
import { SymptomItem } from "@/constants/Symptoms";
import { convertMinToHrMin } from "@/util/SleepSession";
import { router } from "expo-router";
import CalendarService from "@/services/Calendar";

interface HealthInsightsScreenProps {
  todayDayJS: Dayjs;
}

export default function HealthInsightsScreen({
  todayDayJS,
}: HealthInsightsScreenProps) {
  // One statement summary of the day
  const [summary, setSummary] = useState("Today at a glance");
  const [negativeEnergy, setNegativeEnergy] = useState<SymptomItem[]>([]);

  // Summary Statistics for Sleep Data
  const [TODAY_SLEEP_SCORE, setTodaySleepScore] = useState("");
  const [TODAY_SLEEP_DURATION, setTodaySleepDuration] = useState(0);
  const [TODAY_SLEEP_TIME, setTodaySleepTime] = useState<Dayjs | null>(null);
  const [TODAY_SLEEP_WAKEUP, setTodayWakeup] = useState<Dayjs | null>(null);

  // Summary Statistics for Steps Data
  const [TARGET_STEPS, setTargetSteps] = useState(1);
  const [TODAY_STEPS, setTodaySteps] = useState(0);

  // Track

  const getSleepData = async () => {
    // Get last night's sleep data
    const sleepResult = await getLastNightSleepStats(
      todayDayJS.format("YYYY-MM-DD")
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
      setNegativeEnergy(
        energyResult.filter((symptom: SymptomItem) => symptom.isNegative)
      );
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
  }, [todayDayJS]);

  return (
    <>
      {/* Only ask this if TODAY_SLEEP_DURATION < 420 && negativeEnergy.length > 0 && user has not dismissed before */}
      {TODAY_SLEEP_DURATION < 420 && negativeEnergy.length > 0 && (
        <Card mode="elevated" style={{ marginBottom: 20 }}>
          <Card.Content>
            {/* Other variations: You slept late; you slept <7h; your sleep was fragmented */}
            <ThemedText variant="default" style={{ marginBottom: 20 }}>
              You mentioned feeling{" "}
              {negativeEnergy && negativeEnergy[0].label.toLowerCase()} today
              and you only slept {convertMinToHrMin(TODAY_SLEEP_DURATION)} hours
              last night.
            </ThemedText>
            <ThemedText variant="defaultSemiBold" style={{ marginBottom: 10 }}>
              Do you want to schedule a{" "}
              {todayDayJS.hour() < 13 ? "nap" : "meditation session"} later
              today?
            </ThemedText>
          </Card.Content>

          <Card.Actions>
            <Button style={{ marginRight: "auto" }}>No</Button>
            <Button onPress={async () => await CalendarService.checkCalendarForFreeSpace(30)}>Yes</Button>
          </Card.Actions>
        </Card>
      )}

      <SleepCard
        score={TODAY_SLEEP_SCORE}
        duration={TODAY_SLEEP_DURATION}
        sleepTime={TODAY_SLEEP_TIME}
        wakeUpTime={TODAY_SLEEP_WAKEUP}
      />

      <StepsCard todaySteps={TODAY_STEPS} targetSteps={TARGET_STEPS} />

      <WorkoutsCard />
    </>
  );
}

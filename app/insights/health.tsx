import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Card } from "react-native-paper";

import StepsCard from "@/components/cards/StepsCard";
import SleepCard from "@/components/cards/SleepCard";

export default function HealthInsightsScreen() {
  const [TARGET_STEPS, setTargetSteps] = useState(1);
  const [TODAY_STEPS, setTodaySteps] = useState(0);

  const getData = async () => {
    const targetStepsResult = await SecureStore.getItemAsync("targetSteps");
    setTargetSteps(JSON.parse(targetStepsResult || "6000"));

  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <SleepCard />

      <StepsCard todaySteps={TODAY_STEPS} />

      <Card mode="elevated" style={{ marginBottom: 20 }}>
        <Card.Title title="Workouts" subtitle="Workouts this week" />
      </Card>
    </>
  );
}

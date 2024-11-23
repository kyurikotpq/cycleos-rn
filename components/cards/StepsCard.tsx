import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Card } from "react-native-paper";
import { readRecords, StepsRecord } from "react-native-health-connect";
import { Dayjs } from "dayjs";

interface StepsCardProps {
  todaySteps: number;
}

export default function StepsCard({ todaySteps }: StepsCardProps) {
  const [TARGET_STEPS, setTargetSteps] = useState(1);
  const [TODAY_STEPS, setTodaySteps] = useState(0);

  const getData = async () => {
    const targetStepsResult = await SecureStore.getItemAsync("targetSteps");
    setTargetSteps(JSON.parse(targetStepsResult || "6000"));

    // Get Steps, Exercise, and Sleep data from HealthConnect
    // since the last retrieval time and store inside the database
    const stepsResult = await readRecords("Steps", {
      timeRangeFilter: {
        operator: "between",
        startTime: todayDayJS.startOf("day").toISOString(), // @TODO: get since last retrieval time
        endTime: todayDayJS.endOf("day").toISOString(),
      },
      ascendingOrder: false,
    });

    if (stepsResult?.records.length > 0) {
      // @TODO: Store the steps data inside the database

      setTodaySteps(stepsResult.records[0].count);
    }
  };

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <Card
      mode="elevated"
      style={{ marginBottom: 20, overflow: "hidden" }}
      onPress={() => router.push("/insights/steps")}
    >
      <Card.Content
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#ffd000",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${(todaySteps / TARGET_STEPS) * 100}%`,
          }}
        />
        <ThemedView style={{ flexDirection: "column" }}>
          <ThemedText variant="title" style={{ marginBottom: 0 }}>
            {todaySteps}
          </ThemedText>
          <ThemedText>/ {TARGET_STEPS} steps</ThemedText>
        </ThemedView>
      </Card.Content>
    </Card>
  );
}

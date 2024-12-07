import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { readRecords, StepsRecord } from "react-native-health-connect";
import dayjs, { Dayjs } from "dayjs";

interface StepsInsightsScreenProps {
  todayDayJS: Dayjs;
}
export default function StepsInsightsScreen({
  todayDayJS,
}: StepsInsightsScreenProps) {
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

  useEffect(() => {
    // getData();
  }, []);

  return (
    <>
      <ThemedText variant="title">Steps</ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

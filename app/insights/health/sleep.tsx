import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Card } from "react-native-paper";
import { readRecords, SleepSessionRecord } from "react-native-health-connect";
import dayjs, {Dayjs} from "dayjs";

interface SleepInsightsScreenProps {
  todayDayJS: Dayjs;
}

export default function SleepInsightsScreen({ todayDayJS }: SleepInsightsScreenProps) {
//   const [TODAY_Sleep, setTodaySleep] = useState(0);

  const getData = async () => {

    // Get Sleep, Exercise, and Sleep data from HealthConnect
    // since the last retrieval time and store inside the database
    const sleepResult = await readRecords("SleepSession", {
      timeRangeFilter: {
        operator: "between",
        startTime: todayDayJS.startOf("day").toISOString(), // @TODO: get since last retrieval time
        endTime: todayDayJS.endOf("day").toISOString(),
      },
      ascendingOrder: false,
    });

    if (sleepResult?.records.length > 0) {
      // @TODO: Store the Sleep data inside the database

    //   setTodaySleep(sleepResult.records[0]);
    }
  };

  useEffect(() => {
    // getData();
  }, []);

  return (
    <>
      <ThemedText variant="title">Sleep</ThemedText>
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

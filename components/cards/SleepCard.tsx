import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Chip, Card } from "react-native-paper";
import dayjs, { Dayjs } from "dayjs";
import { Ionicons } from "@expo/vector-icons";

interface SleepCardProps {
  todayDayJS: Dayjs;
}

export default function SleepCard() {
  const [TODAY_SLEEP, setTodaySleep] = useState(0);
  const [lastRetrievalTime, setLastRetrievalTime] = useState<number | null>(
    null
  );

  
  return (
    <Card
      mode="elevated"
      style={{ marginBottom: 20, overflow: "hidden" }}
      onPress={() => router.push("/insights/sleep")}
    >
      <Card.Content
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedView style={{ flexDirection: "column" }}>
          <ThemedText variant="title" style={{ marginBottom: 0 }}>
            88
          </ThemedText>
          <ThemedText>Sleep Score</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "column" }}>
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Ionicons
              name="bed"
              style={{ marginRight: 5 }}
              size={20}
              color="black"
            />
            <ThemedText>Sleep Time</ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Ionicons
              name="alarm"
              style={{ marginRight: 5 }}
              size={20}
              color="black"
            />
            <ThemedText>Wake Up Time</ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Ionicons
              name="time"
              style={{ marginRight: 5 }}
              size={20}
              color="black"
            />
            <ThemedText>Duration Time</ThemedText>
          </ThemedView>
        </ThemedView>
      </Card.Content>
    </Card>
  );
}

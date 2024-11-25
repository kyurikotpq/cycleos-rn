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
  targetSteps: number;
}

export default function StepsCard({ todaySteps, targetSteps }: StepsCardProps) {
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
            width: `${(todaySteps / targetSteps) * 100}%`,
          }}
        />
        <ThemedView style={{ flexDirection: "column" }}>
          <ThemedText variant="title" style={{ marginBottom: 0 }}>
            {todaySteps}
          </ThemedText>
          <ThemedText>/ {targetSteps} steps</ThemedText>
        </ThemedView>
      </Card.Content>
    </Card>
  );
}

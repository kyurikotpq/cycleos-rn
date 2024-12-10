import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Card } from "react-native-paper";
import { Dayjs } from "dayjs";
import { CycleOSTheme } from "@/constants/Theme";

interface StepsCardProps {
  todaySteps: number;
  targetSteps: number;
}

export default function StepsCard({ todaySteps, targetSteps }: StepsCardProps) {
  const COMPLETION_RATE = (todaySteps / targetSteps) * 100;

  return (
    <Card
      mode="contained"
      style={{ marginBottom: 20, overflow: "hidden" }}
      onPress={() => router.push("/insights/health/steps")}
    >
      <Card.Content
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: CycleOSTheme.colors.primary,
            top: 0,
            bottom: 0,
            left: 0,
            minWidth: "2%",
            width: `${COMPLETION_RATE}%`,
          }}
        />
        <ThemedView style={{ flexDirection: "column" }}>
          <ThemedText
            variant="title"
            style={{
              marginBottom: 0,
              color:
                COMPLETION_RATE < 30
                  ? CycleOSTheme.colors.onSurface
                  : CycleOSTheme.colors.onPrimary,
            }}
          >
            {todaySteps}
          </ThemedText>
          <ThemedText
            style={{
              color:
                COMPLETION_RATE < 30
                  ? CycleOSTheme.colors.onSurface
                  : CycleOSTheme.colors.onPrimary,
            }}
          >
            / {targetSteps} steps
          </ThemedText>
        </ThemedView>
        {todaySteps > targetSteps && (
          <ThemedText variant="title" style={{ marginBottom: 0 }}>
            🎉
          </ThemedText>
        )}
      </Card.Content>
    </Card>
  );
}

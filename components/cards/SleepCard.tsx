import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { Card } from "react-native-paper";
import { Dayjs } from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { convertMinToHrMin } from "@/util/SleepSession";
import { Pressable } from "react-native";

interface SleepCardProps {
  score: string; // One of the energy construct values from Symptoms.ts
  sleepTime: Dayjs | null;
  wakeUpTime: Dayjs | null;
  duration: number;
}

export default function SleepCard({
  score,
  sleepTime,
  wakeUpTime,
  duration,
}: SleepCardProps) {
  return (
    <Card
      mode="contained"
      style={{ marginBottom: 20 }}
      onPress={() => router.push("/insights/health/sleep")}
    >
      <Card.Content
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        <ThemedView>
          {duration > 0 ? (
            score != "" ? (
              <ThemedView style={{ justifyContent: "center", flex: 1 }}>
                <ThemedText>I'm feeling</ThemedText>
                <ThemedText variant="title" style={{ marginBottom: 0 }}>
                  {score}
                </ThemedText>
              </ThemedView>
            ) : (
              <Pressable
                style={{ justifyContent: "center", flex: 1 }}
                onPress={() =>
                  router.push({
                    pathname: "/tracking",
                    params: { insights: "true" },
                  })
                }
              >
                <ThemedText variant="defaultSemiBold">
                  How are you feeling today?
                </ThemedText>
                <ThemedText variant="link" style={{ marginBottom: 0 }}>
                  Tap here to record your energy.
                </ThemedText>
              </Pressable>
            )
          ) : (
            <>
              <ThemedText variant="defaultSemiBold">
                No sleep recorded last night.
              </ThemedText>
              <ThemedText variant="link" style={{ fontSize: 14 }}>
                See previous sleep records ➡️
              </ThemedText>
            </>
          )}
        </ThemedView>
        {/* If a sleep was recorded last night, show detail */}
        {duration > 0 && (
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
              <ThemedText>{sleepTime?.format("hh:mm A")}</ThemedText>
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
              <ThemedText>{wakeUpTime?.format("hh:mm A")}</ThemedText>
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
              <ThemedText>{convertMinToHrMin(duration)}</ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      </Card.Content>
    </Card>
  );
}

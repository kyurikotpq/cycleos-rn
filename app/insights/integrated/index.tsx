import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Card } from "react-native-paper";

export default function IntegratedInsightsScreen() {
  return (
    <>
      {/* @TODO: Add nice Header Images to the cards */}
      <Card
        mode="elevated"
        style={{ marginBottom: 20 }}
        onPress={() => router.push("/insights/integrated/phase")}
      >
        <Card.Content>
          <ThemedText variant="subtitle">
            How does your sleep and exercise vary across the cycle?
          </ThemedText>
        </Card.Content>
      </Card>
      <Card
        mode="elevated"
        style={{ marginBottom: 20 }}
        onPress={() => router.push("/insights/integrated/correlation")}
      >
        <Card.Content>
          <ThemedText variant="subtitle">
            Do your exercise habits affect your sleep (or vice versa)?
          </ThemedText>
        </Card.Content>
      </Card>
    </>
  );
}

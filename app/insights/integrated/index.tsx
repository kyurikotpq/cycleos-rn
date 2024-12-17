import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Card } from "react-native-paper";
import { Linking } from "react-native";
import { CycleOSTheme } from "@/constants/Theme";

export default function IntegratedInsightsScreen() {
  const openEmailClientForFeedback = () => {
    Linking.openURL(
      "mailto:kyurikotpq+cycleos@gmail.com?subject=Suggestions%20For%20Integrated%20Trends"
    );
  };

  return (
    <>
      <Card
        // mode="contained"
        style={{ marginBottom: 20, position: "relative" }}
        onPress={() => router.push("/insights/integrated/phase")}
      >
        <Card.Cover
          source={require("@/assets/images/heatmap-card-cover.jpg")}
          style={{ opacity: 0.2 }}
          blurRadius={2}
        />
        <ThemedText variant="subtitle" style={{ position: "absolute", bottom: 0, left: 0, padding: 20 }}>
          How does your sleep and exercise vary across the cycle?
        </ThemedText>
      </Card>
      <Card
        mode="outlined"
        style={{
          marginBottom: 20,
          backgroundColor: CycleOSTheme.colors.primaryContainer,
        }}
        onPress={openEmailClientForFeedback}
      >
        <Card.Content>
          <ThemedText variant="subtitle" style={{ marginBottom: 10 }}>
            💌 What other insights would you like to see in CycleOS?
          </ThemedText>
          <ThemedText>Tap here to email Pei with your suggestions!</ThemedText>
        </Card.Content>
      </Card>
    </>
  );
}

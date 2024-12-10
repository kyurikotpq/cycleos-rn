import { router } from "expo-router";
import { Avatar, Card } from "react-native-paper";

export default function WorkoutsCard() {
  return (
    <Card
      mode="contained"
      style={{ marginBottom: 20 }}
      onPress={() => router.push("/insights/health/workouts")}
    >
      <Card.Title title="Workouts" titleVariant="titleMedium" subtitle="No workouts this week." />
    </Card>
  );
}

import { SafeAreaView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card, Text } from "react-native-paper";

/**
 * This page shows:
 * 1) daily suggestions based on menstrual phase, exercise, and sleep data
 * 2) a prompt to do their daily symptom check-in
 */
export default function Hormonoscope() {
  return (
    <SafeAreaView>
      <ThemedView style={styles.p20}>
        {/* Note: I keep changing the font weight, might componentize it */}
        <ThemedView>
          <Text variant="titleLarge" style={{ fontWeight: 700 }}>
            Today at a Glance
          </Text>
          <Card>
            <ThemedText>
              @TODO: Daily suggestions based on menstrual phase, exercise, and
              sleep data
            </ThemedText>
          </Card>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  p20: {
    padding: 20,
  },
});

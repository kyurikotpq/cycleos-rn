import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Chip,
  Searchbar,
  Drawer,
  Card,
  Text,
  TextInput,
  Appbar,
} from "react-native-paper";
import { useState } from "react";
import { router } from "expo-router";
import SYMPTOMS from "@/constants/Symptoms";

/**
 * This page shows:
 * 1) daily suggestions based on menstrual phase, exercise, and sleep data
 * 2) a prompt to do their daily symptom check-in
 */
export default function Hormonoscope() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    {
      label: "Bloating",
      value: "bloating",
    },
  ]);

  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.Action
          icon="close"
          onPress={() => {
            router.back();
          }}
        />

        <Appbar.Content
          title={`Logs for ${new Date().toLocaleDateString()}`}
          titleStyle={{ textAlign: "center" }}
        />
        <Appbar.Action icon="calendar" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView style={styles.p20}>
        <ThemedView style={styles.p20}>
          <ThemedText>@TODO: Date picker goes here at some point</ThemedText>
        </ThemedView>
        <Text
          variant="titleLarge"
          style={{ fontWeight: 700, marginBottom: 10 }}
        >
          How are you feeling today?
        </Text>
        <Searchbar
          mode="view"
          placeholder="E.g. Bloating"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 20 }}
        />

        <ThemedView
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 30 }}
        >
          {selectedSymptoms.map((symptom) => (
            <Chip
              closeIcon="close"
              onClose={() =>
                setSelectedSymptoms(
                  selectedSymptoms.filter((item) => item.label != symptom.label)
                )
              }
              style={{ marginRight: 10, marginBottom: 10 }}
            >
              {symptom.label}
            </Chip>
          ))}
        </ThemedView>

        {/* @TODO: Figure out custom icons */}
        {SYMPTOMS.map((category) => (
          <ThemedView style={{ marginBottom: 20 }}>
            <Text variant="labelLarge" style={{ marginBottom: 10 }}>
              {category.label}
            </Text>
            <ThemedView style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {category.items.map((item) => (
                <Chip showSelectedCheck={true} style={{ marginRight: 10 }}>
                  {item.label}
                </Chip>
              ))}
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  p20: {
    padding: 20,
  },
});

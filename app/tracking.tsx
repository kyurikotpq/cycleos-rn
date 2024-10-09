import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Chip,
  Searchbar,
  Text,
  Appbar,
  Divider,
  Button,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SYMPTOMS, SymptomItem } from "@/constants/Symptoms";

/**
 * This page shows:
 * 1) daily suggestions based on menstrual phase, exercise, and sleep data
 * 2) a prompt to do their daily symptom check-in
 */
export default function Hormonoscope() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomItem[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState<Symptom[]>(SYMPTOMS);

  const toggleSymptom = (symptom: SymptomItem) => {
    if (selectedSymptoms.includes(symptom)) {
      removeSymptom(symptom);
    } else setSelectedSymptoms([...selectedSymptoms, symptom]);
  };

  const removeSymptom = (item: SymptomItem) => {
    setSelectedSymptoms(
      selectedSymptoms.filter((symptom) => item.label != symptom.label)
    );
  };

  const isSymptom = (symptomLabel: string) => {
    return symptomLabel.toLowerCase().includes(searchQuery.toLowerCase());
  };

  useEffect(() => {
    setFilteredSymptoms(
      SYMPTOMS.filter((category) =>
        category.items.some((symptom) => isSymptom(symptom.label))
      )
    );
  }, [searchQuery]);

  return (
    <SafeAreaView style={{ height: "100%" }}>
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
      <ScrollView
        style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 40 }}
      >
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

        <Divider style={{ marginBottom: 30 }} />
        {/* @TODO: Figure out custom icons */}
        {filteredSymptoms.map(
          (category) =>
            category.items.length > 0 && (
              <ThemedView style={{ marginBottom: 30 }} key={category.label}>
                <Text variant="labelLarge" style={{ marginBottom: 10 }}>
                  {category.label}
                </Text>
                <ThemedView style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {category.items.map(
                    (symptom: SymptomItem) =>
                      isSymptom(symptom.label) && (
                        <Chip
                          showSelectedCheck={true}
                          style={{ marginRight: 10 }}
                          key={symptom.label}
                          selected={selectedSymptoms.includes(symptom)}
                          onPress={() => toggleSymptom(symptom)}
                        >
                          {symptom.label}
                        </Chip>
                      )
                  )}
                </ThemedView>
              </ThemedView>
            )
        )}
      </ScrollView>
      <Button
        mode="contained"
        style={{
          position: "fixed",
          bottom: 20,
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        Save
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  p20: {
    padding: 20,
  },
});

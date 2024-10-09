import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Chip, Searchbar, Appbar, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SYMPTOMS, SymptomItem } from "@/constants/Symptoms";

/**
 * This page shows:
 * 1) a list of symptoms that the user can select from
 * 2) @TODO: a calendar picker that allows retrospective tagging of symptoms (NOT implemented yet)
 */
export default function TrackingScreen() {
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

  const saveSymptoms = () => {};

  useEffect(() => {
    if (searchQuery.length > 2) {
      setFilteredSymptoms(
        SYMPTOMS.filter((category) =>
          category.items.some((symptom) => isSymptom(symptom.label))
        )
      );
    }
  }, [searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Action
          icon="close"
          onPress={() => {
            router.back();
          }}
        />

        <Appbar.Content
          title={`Logs for ${new Date().toLocaleDateString()}`}
          titleStyle={{ textAlign: "center", fontWeight: "bold" }}
        />
        <Appbar.Action icon="calendar" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView
        style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 40 }}
      >
        <ThemedView style={styles.p20}>
          <ThemedText>@TODO: Date picker goes here at some point</ThemedText>
        </ThemedView>
        <ThemedText
          variant="title"
          style={{ fontWeight: 700, marginBottom: 10 }}
        >
          How are you feeling today?
        </ThemedText>
        <Searchbar
          mode="view"
          placeholder="E.g. Bloating"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 30 }}
        />

        {/* @TODO: Figure out custom icons */}
        {/* @TODO: Maybe make categories collapsible? */}
        {filteredSymptoms.map(
          (category) =>
            category.items.length > 0 && (
              <ThemedView style={{ marginBottom: 30 }} key={category.label}>
                <ThemedText
                  variant="defaultSemiBold"
                  style={{ marginBottom: 10 }}
                >
                  {category.label}
                </ThemedText>
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
        onPress={saveSymptoms}
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

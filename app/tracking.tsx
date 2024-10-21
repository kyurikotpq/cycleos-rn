import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Chip, Searchbar, Appbar, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  SYMPTOMS,
  SYMPTOMS_CATEGORIZED,
  SymptomCategory,
  SymptomItem,
} from "@/constants/Symptoms";
import DateUtil from "@/util/Date";
import {
  fetchSymptomsAtDate,
  updateSymptomsTransaction,
} from "@/db/controllers/symptoms";
import WeekViewDatePicker from "@/components/WeekViewDatePicker";

/**
 * This page shows:
 * 1) a list of symptoms that the user can select from
 * 2) @TODO: a calendar picker that allows retrospective tagging of symptoms (NOT implemented yet)
 */
export default function SymptomTrackingScreen() {
  const today = new Date();
  const [saved, setSaved] = useState("Save");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbSymptoms, setDbSymptoms] = useState<SymptomItem[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomItem[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] =
    useState<SymptomCategory[]>(SYMPTOMS_CATEGORIZED);
  const [currentDate, setCurrentDate] = useState(
    today.toISOString().split("T")[0]
  );

  const compareArrays = (
    before: number[],
    after: number[]
  ): { to_delete: number[]; to_insert: number[] } => {
    // Elements to be deleted (present in 'before' but not in 'after')
    const to_delete = before.filter((item) => !after.includes(item));

    // Elements to be inserted (present in 'after' but not in 'before')
    const to_insert = after.filter((item) => !before.includes(item));

    return {
      to_delete,
      to_insert,
    };
  };

  // @TODO: There's a small bug... sometimes the touch doesn't register
  const toggleSymptom = (symptom: SymptomItem) => {
    if (selectedSymptoms.includes(symptom)) {
      removeSymptom(symptom);
    } else setSelectedSymptoms([...selectedSymptoms, symptom]);
  };

  const removeSymptom = (item: SymptomItem) => {
    // We can do this because objects are by reference
    setSelectedSymptoms(
      selectedSymptoms.filter((symptom) => symptom.id !== item.id)
    );
  };

  const isSymptom = (symptomLabel: string) => {
    return symptomLabel.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const getSymptomsAtDate = async (date: string) => {
    const selectedDate = new Date(date);
    if (selectedDate > today) return;

    const symptoms = await fetchSymptomsAtDate(date);

    setSelectedSymptoms(symptoms);
    setDbSymptoms(symptoms);
    setCurrentDate(date);
  };

  const saveSymptoms = async () => {
    // Save cycle to DB
    if (selectedSymptoms.length == 0) {
      setSaved("Save");
      return;
    }

    setSaved("Saving...");
    const { to_delete, to_insert } = compareArrays(
      dbSymptoms.map((symptom) => symptom.id),
      selectedSymptoms.map((symptom) => symptom.id)
    );
    console.log(currentDate, to_insert, to_delete);
    const transactionResult = await updateSymptomsTransaction(
      to_insert.map((symptomId) => ({ dayId: currentDate, symptomId })),
      to_delete,
      currentDate
    );
    setSaved("Saved!");
  };

  useEffect(() => {
    getSymptomsAtDate(currentDate);
    console.log("called");
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setFilteredSymptoms(
        SYMPTOMS_CATEGORIZED.filter((category) =>
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
          title={`Logs for ${DateUtil.parseISODate(
            currentDate
          ).toLocaleDateString()}`}
          titleStyle={{ textAlign: "center", fontWeight: "bold" }}
        />
        <Appbar.Action icon="calendar" onPress={() => {}} />
      </Appbar.Header>
      <ThemedView
        style={{
          height: 80,
          marginBottom: 20,
        }}
      >
        <WeekViewDatePicker
          maxDate={today.toISOString().split("T")[0]}
          onDateChanged={getSymptomsAtDate}
        />
      </ThemedView>

      <ScrollView style={{ padding: 20, marginBottom: 40 }}>
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
                          key={symptom.id}
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
        icon={saved == "Saved!" ? "check" : undefined}
        disabled={saved != "Save"}
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

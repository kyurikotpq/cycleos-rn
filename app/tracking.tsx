import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Chip, Searchbar, Appbar, Button } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
  SYMPTOMS_CATEGORIZED,
  SymptomCategory,
  SymptomItem,
} from "@/constants/Symptoms";
import {
  fetchSymptomsAtDate,
  updateSymptomsTransaction,
} from "@/db/controllers/symptoms";
import WeekViewDatePicker from "@/components/WeekViewDatePicker";
import IsSavingButton from "@/components/IsSavingButton";
import { fromDateId, toDateId } from "@marceloterreiro/flash-calendar";

/**
 * This page shows:
 * 1) a list of symptoms that the user can select from
 * 2) a calendar picker that allows retrospective tagging of symptoms
 */
export default function SymptomTrackingScreen() {
  const today = new Date();

  const [searchQuery, setSearchQuery] = useState("");
  const [dbSymptoms, setDbSymptoms] = useState<SymptomItem[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomItem[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] =
    useState<SymptomCategory[]>(SYMPTOMS_CATEGORIZED);
  const [saveState, setSaveState] = useState("Save");

  const datepickerRef = useRef<any>(null);
  const [currentDate, setCurrentDate] = useState(toDateId(today));

  const compareArrays = (
    before: number[],
    after: number[]
  ): { toDelete: number[]; toInsert: number[] } => {
    // Elements to be deleted (present in 'before' but not in 'after')
    const toDelete = before.filter((item) => !after.includes(item));

    // Elements to be inserted (present in 'after' but not in 'before')
    const toInsert = after.filter((item) => !before.includes(item));

    return {
      toDelete,
      toInsert,
    };
  };

  const toggleSymptom = (symptom: SymptomItem) => {
    if (isSelected(symptom.id)) {
      removeSymptom(symptom);
    } else setSelectedSymptoms([...selectedSymptoms, symptom]);

    setSaveState("Save");
  };

  const removeSymptom = (item: SymptomItem) => {
    // We can do this because objects are by reference
    setSelectedSymptoms(
      selectedSymptoms.filter((symptom) => symptom.id !== item.id)
    );
  };

  const isSelected = (symptomId: number) =>
    selectedSymptoms.some((s) => s.id == symptomId);

  const isSymptom = (symptomLabel: string) => {
    return (
      searchQuery.length < 2 ||
      symptomLabel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getSymptomsAtDate = async (date: string) => {
    const selectedDate = new Date(date);
    if (selectedDate > today) return;

    const symptoms: SymptomItem[] = await fetchSymptomsAtDate(date);

    setSelectedSymptoms(symptoms);
    setDbSymptoms(symptoms);
    setCurrentDate(date);
    setSaveState("Saved!");
  };

  const saveSymptoms = async () => {
    // Save cycle to DB
    setSaveState("Saving...");
    const { toDelete, toInsert } = compareArrays(
      dbSymptoms.map((symptom) => symptom.id),
      selectedSymptoms.map((symptom) => symptom.id)
    );

    if (toDelete.length == 0 && toInsert.length == 0) {
      setSaveState("Saved!");
      return;
    }

    const cycleDay = {
      id: currentDate,
      zoneOffset: today.getTimezoneOffset(),
    };

    const transactionResult = await updateSymptomsTransaction(
      toInsert.map((symptomId) => ({ dayId: currentDate, symptomId })),
      toDelete,
      cycleDay
    );

    setSaveState("Saved!");
  };

  useEffect(() => {
    getSymptomsAtDate(currentDate);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setFilteredSymptoms(
        SYMPTOMS_CATEGORIZED.filter((category) =>
          category.items.some((symptom) => isSymptom(symptom.label))
        )
      );
    } else if (searchQuery.length == 0) {
      setFilteredSymptoms(SYMPTOMS_CATEGORIZED);
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
          title={`Logs for ${fromDateId(currentDate).toLocaleDateString()}`}
          titleStyle={{ textAlign: "center", fontWeight: "bold" }}
        />

        {/* Scroll to Today */}
        <Appbar.Action
          icon="calendar"
          onPress={() => {
            getSymptomsAtDate(toDateId(today));
            datepickerRef?.current?.scrollToToday();
          }}
        />
      </Appbar.Header>
      <ThemedView
        style={{
          height: 80,
          marginBottom: 20,
        }}
      >
        <WeekViewDatePicker
          maxDate={toDateId(today)}
          onDateChanged={getSymptomsAtDate}
          ref={datepickerRef}
          currentSelectedDate={currentDate}
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
                          selected={isSelected(symptom.id)}
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

      <IsSavingButton onPressCB={saveSymptoms} saveState={saveState} />
    </SafeAreaView>
  );
}

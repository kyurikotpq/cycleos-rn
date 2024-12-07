import { useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import {
  Chip,
  Searchbar,
  Appbar,
  IconButton,
  Portal,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
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
import dayjs from "dayjs";
import LogSymptomInfoDialog from "@/components/dialogs/LogSymptomInfoDialog";
import VisitInsightsDialog from "@/components/dialogs/VisitInsightsDialog";

/**
 * This page shows:
 * 1) a list of symptoms that the user can select from
 * 2) a calendar picker that allows retrospective tagging of symptoms
 */
export default function SymptomTrackingScreen() {
  const localRouteParams = useLocalSearchParams();
  const today = new Date();

  // Explanation Dialog State
  const [visible, setVisible] = useState(false);
  const showExplanationDialog = () => setVisible(true);
  const hideExplanationDialog = () => setVisible(false);

  // Insights Dialog State
  const [visitInsightsDialogVisible, setVisitInsightsDialogVisible] =
    useState(false);
  const showInsightsDialog = () => setVisitInsightsDialogVisible(true);
  const hideInsightsDialog = () => setVisitInsightsDialogVisible(false);

  // Filtering of symptoms by search
  const [searchQuery, setSearchQuery] = useState("");
  const [dbSymptoms, setDbSymptoms] = useState<SymptomItem[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomItem[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] =
    useState<SymptomCategory[]>(SYMPTOMS_CATEGORIZED);
  const [saveState, setSaveState] = useState("Save");

  // Datepicker reference
  const datepickerRef = useRef<any>(null);

  // Date currently picked (defaults to today)
  const [currentDate, setCurrentDate] = useState(toDateId(today));

  // Helper function to compare two arrays for differences
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

  // Toggle symptom selection
  const toggleSymptom = (symptom: SymptomItem) => {
    if (isSelected(symptom.id)) {
      removeSymptom(symptom);
    } else setSelectedSymptoms([...selectedSymptoms, symptom]);

    setSaveState("Save");
  };

  // Remove symptom from selected list
  const removeSymptom = (item: SymptomItem) => {
    // We can do this because objects are by reference
    setSelectedSymptoms(
      selectedSymptoms.filter((symptom) => symptom.id !== item.id)
    );
  };

  // Check if a symptom is selected
  const isSelected = (symptomId: number) =>
    selectedSymptoms.some((s) => s.id == symptomId);

  // Check if the search query is valid & the symptom matches the search query
  const isSymptom = (symptomLabel: string) => {
    return (
      searchQuery.length < 2 ||
      symptomLabel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Fetch symptoms for a specific date from DB
  const getSymptomsAtDate = async (date: string) => {
    const selectedDate = new Date(date);
    if (selectedDate > today) return;

    const symptoms: SymptomItem[] = await fetchSymptomsAtDate(date);

    setSelectedSymptoms(symptoms);
    setDbSymptoms(symptoms);
    setCurrentDate(date);
    setSaveState("Saved!");
  };

  // Save symptoms to DB for the currently selected date
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
      zoneOffset: -today.getTimezoneOffset(),
    };

    const transactionResult = await updateSymptomsTransaction(
      toInsert.map((symptomId) => ({
        dayId: currentDate,
        symptomId,
      })),
      toDelete,
      cycleDay
    );

    if (currentDate === toDateId(today)) {
      // Update last check-in time if we're saving
      // symptoms for today
      await SecureStore.setItemAsync(
        "lastSymptomCheckInTime",
        JSON.stringify(today.getTime())
      );

      // If we came from the Agenda page, ask if the user wants to
      // 1) go back to the Agenda page or
      // 2) view their insights for today (hormonoscope page)
      if (localRouteParams?.insights === "true") {
        // Note: we can only parse string params, hence the "true" string
        showInsightsDialog();
      }
    }

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
      <ScrollView
        style={{
          paddingTop: 10,
          paddingLeft: 20,
          paddingRight: 20,
          marginBottom: 40,
        }}
      >
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <ThemedText
            variant="subtitle"
            style={{
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            {currentDate === toDateId(today)
              ? "How are you feeling today?"
              : "How did you feel on this day?"}
          </ThemedText>

          {/* Icon to trigger explanation diaglog */}
          <IconButton
            icon="information"
            size={20}
            onPress={showExplanationDialog}
          />
        </ThemedView>
        <Searchbar
          mode="view"
          placeholder="E.g. Bloating"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 30 }}
        />
        {/* @TODO: Figure out custom iconButtons */}
        {/* @TODO: Maybe make categories collapsible? */}
        {filteredSymptoms.map(
          (category) =>
            category.items.length > 0 && (
              <ThemedView style={{ marginBottom: 20 }} key={category.label}>
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
                          style={{ marginRight: 10, marginBottom: 10 }}
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
      <Portal>
        {/* Dialog to explain how to log symptoms */}
        <LogSymptomInfoDialog
          visible={visible}
          onDismiss={hideExplanationDialog}
          children={undefined}
        />
        {/* Dialog to route to Hormonoscope page */}
        <VisitInsightsDialog
          visible={visitInsightsDialogVisible}
          onDismiss={(confirm: boolean) =>
            !confirm
              ? hideInsightsDialog()
              : router.replace("/insights/health/hormonoscope")
          }
        />
      </Portal>
    </SafeAreaView>
  );
}

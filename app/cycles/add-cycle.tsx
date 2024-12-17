import { SafeAreaView, View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { router } from "expo-router";
import {
  Calendar,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import { createCycle } from "@/db/controllers/cycles";
import DateRangePicker from "@/components/DateRangePicker";
import IsSavingButton from "@/components/IsSavingButton";

/**
 * This page shows:
 * 1) a list of symptoms that the user can select from
 * 2) @TODO: a calendar picker that allows retrospective tagging of symptoms (NOT implemented yet)
 */
export default function AddCycleScreen() {
  const [saveState, setSaveState] = useState("Save");

  const {
    calendarActiveDateRanges,
    onCalendarDayPress,
    dateRange, // { startId?: string, endId?: string }
  } = useDateRange();

  // @TODO: Optimize this
  const avgCycleLength = parseInt(
    SecureStore.getItem("avgCycleLength") || "28"
  );

  const createCycleInDB = async () => {
    // Save cycle to DB
    setSaveState("Saving...");
    const result = await createCycle(dateRange, avgCycleLength);
    setSaveState("Saved!");
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, marginBottom: 20 }}>
        <DateRangePicker
          calendarPastScrollRangeInMonths={18}
          calendarMaxDateId={toDateId(new Date())}
          calendarActiveDateRanges={calendarActiveDateRanges}
          onCalendarDayPress={onCalendarDayPress}
        />
      </View>
      <IsSavingButton onPressCB={createCycleInDB} saveState={saveState} />
    </SafeAreaView>
  );
}


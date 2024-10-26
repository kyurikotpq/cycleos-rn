import { SafeAreaView, View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Button } from "react-native-paper";
import { useState } from "react";
import { router } from "expo-router";
import {
  Calendar,
  toDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import { createCycle } from "@/db/controllers/cycles";

/**
 * This page shows:
 * 1) a list of symptoms that the user can select from
 * 2) @TODO: a calendar picker that allows retrospective tagging of symptoms (NOT implemented yet)
 */
export default function AddCycleScreen() {
  const [saved, setSaved] = useState("Save");
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
    setSaved("Saving...");

    const result = await createCycle(dateRange, avgCycleLength);
    setSaved("Saved!");

    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, marginBottom: 20 }}>
        <Calendar.List
          calendarDayHeight={30}
          calendarFirstDayOfWeek="sunday"
          calendarRowHorizontalSpacing={16}
          calendarRowVerticalSpacing={16}
          calendarPastScrollRangeInMonths={18}
          calendarMaxDateId={toDateId(new Date())}
          calendarActiveDateRanges={calendarActiveDateRanges}
          onCalendarDayPress={onCalendarDayPress}
        />
      </View>
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
        onPress={createCycleInDB}
      >
        {saved}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  p20: {
    padding: 20,
  },
});

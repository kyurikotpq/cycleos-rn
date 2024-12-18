import { SafeAreaView, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarActiveDateRange,
  CalendarListRef,
  CalendarOnDayPress,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import {
  createCycle,
  getAllPeriodsDateRanges,
  getAverageCycleAndPeriodLength,
} from "@/db/controllers/cycles";
import DateRangePicker from "@/components/DateRangePicker";
import IsSavingButton from "@/components/IsSavingButton";
import { Snackbar } from "react-native-paper";
import { NUM_MS_PER_DAY } from "@/constants/Time";
import { Cycle } from "@/db/schema";
import { handleDateSelection } from "@/util/DateRange";

/**
 * This page shows:
 * 1) a list of symptoms that the user can select from
 * 2) @TODO: a calendar picker that allows retrospective tagging of symptoms (NOT implemented yet)
 */

export default function AddCycleScreen() {
  const localRouteParams = useLocalSearchParams();
  const ref = useRef<CalendarListRef>(null);

  // Save Button state
  const [saveState, setSaveState] = useState("Save");

  // Snackbar state
  const [visible, setVisible] = useState(false);

  // Selected date ranges
  const [originalRanges, setOriginalRanges] = useState<
    CalendarActiveDateRange[]
  >([]);

  const [selectedRanges, setSelectedRanges] = useState<
    CalendarActiveDateRange[]
  >([]);

  // @TODO: Optimize this
  const prevAvgCycleLength = parseInt(
    SecureStore.getItem("avgCycleLength") || "28"
  );

  const createCycleInDB = async () => {
    // Compare updated ranges to the original ranges and return only the changed ones
    const changedRanges = selectedRanges.filter(
      (newRange) =>
        !originalRanges.some(
          (originalRange) =>
            originalRange.startId === newRange.startId &&
            originalRange.endId === newRange.endId
        )
    );
    console.log("CHANGED RANGES", changedRanges);
    if (changedRanges.length == 0) {
      setSaveState("Saved!");
      router.back();
      return;
    }

    // Save cycle to DB
    try {
      setSaveState("Saving...");
      const results = await Promise.all(
        changedRanges.map((dateRange) =>
          createCycle(dateRange, prevAvgCycleLength)
        )
      );

      // Update avgCycleLength and avgPeriodLength
      const averages = await getAverageCycleAndPeriodLength();
      if (averages.length > 0) {
        const { avgCycleLength, avgPeriodLength } = averages[0];
        if (avgCycleLength)
          await SecureStore.setItem(
            "avgCycleLength",
            Math.floor(parseFloat(avgCycleLength)).toString()
          );

        if (avgPeriodLength)
          await SecureStore.setItem(
            "avgPeriodLength",
            Math.floor(parseFloat(avgPeriodLength)).toString()
          );
      }

      setSaveState("Saved!");
      router.back();
    } catch (error) {
      setVisible(true);
    }
  };

  const handleSnackbarDismiss = () => {
    setSaveState("Save");
    setVisible(false);
  };

  // Based on: https://marceloprado.github.io/flash-calendar/fundamentals/troubleshooting#calendarlist-is-slow-when-using-date-ranges
  const onCalendarDayPress = useCallback<CalendarOnDayPress>((dateId) => {
    setSelectedRanges((ranges) => handleDateSelection(dateId, ranges, 4));
  }, []);

  const fetchPeriodDateRanges = async () => {
    // Show date ranges of already-recorded periods
    const ranges = (await getAllPeriodsDateRanges()) as Cycle[];
    const activeRanges: CalendarActiveDateRange[] = ranges.map(
      (range: Cycle) => ({
        startId: toDateId(new Date(range.startDate ?? 0)),
        endId: toDateId(
          new Date(
            (range.startDate ?? 0) +
              ((range.periodLength ?? 0) - 1) * NUM_MS_PER_DAY
          )
        ),
      })
    );
    setSelectedRanges(activeRanges);
    setOriginalRanges(activeRanges);
  };

  useEffect(() => {
    // If editing a cycle, scroll to the cycle's start date
    if (
      localRouteParams?.scrollTo &&
      typeof localRouteParams.scrollTo === "string" &&
      localRouteParams.scrollTo != "-1"
    ) {
      ref.current?.scrollToDate(
        new Date(parseInt(localRouteParams.scrollTo) - NUM_MS_PER_DAY * 28),
        true
      );
    }

    // Get all period date ranges from the database
    fetchPeriodDateRanges();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <DateRangePicker
          calendarPastScrollRangeInMonths={12}
          calendarMaxDateId={toDateId(new Date())}
          calendarActiveDateRanges={selectedRanges}
          onCalendarDayPress={onCalendarDayPress}
          innerRef={ref}
        />
      </View>
      <IsSavingButton onPressCB={createCycleInDB} saveState={saveState} />
      <Snackbar
        visible={visible}
        onDismiss={handleSnackbarDismiss}
        action={{
          label: "OK",
          onPress: handleSnackbarDismiss,
        }}
      >
        Cycle already exists. Please select a different date range.
      </Snackbar>
    </SafeAreaView>
  );
}

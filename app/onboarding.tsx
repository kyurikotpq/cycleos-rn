import React, { useState } from "react";
import { TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";

import * as SecureStore from "expo-secure-store";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import DateRangePicker from "@/components/DateRangePicker";
import { useDateRange } from "@marceloterreiro/flash-calendar";
import { initDB } from "./models/init-db";
import * as Cycles from "./models/cycles";
import DateUtil from "@/constants/Date";
import PERMISSIONS from "@/constants/Permissions";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [avgPeriodLength, setAvgPeriodLength] = useState("");
  const [avgCycleLength, setAvgCycleLength] = useState("");
  const MAX_STEPS = 5;

  // Go to the next step
  const nextStep = () => {
    if (step < MAX_STEPS) {
      setStep(step + 1);
    }
  };

  const {
    calendarActiveDateRanges,
    // Also available for your convenience:
    onCalendarDayPress,
    dateRange, // { startId?: string, endId?: string }
    // isDateRangeValid, // boolean
    // onClearDateRange, // () => void
  } = useDateRange();

  // Save onboarding data to SecureStore
  const saveOnboardingData = async () => {
    // Store running averages in SecureStore
    if (avgPeriodLength !== "") {
      const _ = await SecureStore.setItemAsync(
        "avgPeriodLength",
        avgPeriodLength
      );
    }
    if (avgCycleLength !== "") {
      const _ = await SecureStore.setItemAsync(
        "avgCycleLength",
        avgCycleLength
      );
    }

    // Store last period as a SQL record
    if (avgPeriodLength === "" && dateRange.startId && dateRange.endId) {
      const _ = await initDB();

      // Get the timezone offset in minutes and convert it to hours
      const zone_offset = DateUtil.getTimezoneOffset(new Date());

      const result = await Cycles.create({
        start_date: dateRange.startId,
        start_zone_offset: zone_offset,
        end_date: dateRange.endId,
        end_zone_offset: zone_offset,

        period_length: DateUtil.getDuration(dateRange.startId, dateRange.endId),
        cycle_length: parseInt(avgCycleLength),
      });

      console.log("Onboarding complete:", {
        avgPeriodLength,
        avgCycleLength,
        dateRange,
      });

      // Route to HealthConnect Page
      setStep(5);
    }
  };

  const requestHCPermission = async () => {
    // Initialize the client
    const _ = await initialize();

    // request permissions
    const grantedPermissions = await requestPermission(PERMISSIONS);

    // check if granted
    const result = await readRecords("Steps", {
      timeRangeFilter: {
        operator: "between",
        startTime: "2024-01-09T12:00:00.405Z",
        endTime: "2024-01-10T23:53:15.405Z",
      },
    });

    console.log("HealthConnect permissions granted:", result);
    
    // Route to the index page
    // onComplete();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Screen 1: CycleOS Welcome Screen */}
      {/* @TODO: can be more fancy and add animations */}
      {step === 1 && (
        <ThemedView style={styles.screen}>
          <Image
            source={require("@/assets/images/undraw-womens-day.png")}
            style={{
              alignSelf: "center",
              height: "40%",
              resizeMode: "contain",
            }}
          />
          <ThemedText>Hustle Less, Flow More.</ThemedText>

          {/* @TODO Perhaps refactor this into a button component */}
          <TouchableOpacity
            onPress={nextStep}
            style={{
              ...styles.button,
              position: "absolute",
              bottom: 0,
              width: "100%",
            }}
          >
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* Screen 2: Average Cycle Length */}
      {step === 2 && (
        <ThemedView>
          <ThemedText style={styles.header}>
            What is the average length of your cycle?
          </ThemedText>
          <ThemedText>
            Count from the first day of one period to the day before the next
            period starts.
          </ThemedText>
          {/* @TODO: Allow checkbox for cycle irregularity */}
          <TextInput
            style={styles.input}
            value={avgCycleLength}
            onChangeText={setAvgCycleLength}
            keyboardType="numeric"
          />

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setAvgCycleLength("28")}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>I don't know</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextStep} style={styles.button}>
              <ThemedText style={styles.buttonText}>Next</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}

      {/* Screen 3a: Start and end of last Period */}
      {step === 3 && (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.header}>
            When was your last period? Select start and end dates.
          </ThemedText>
          <DateRangePicker
            onCalendarDayPress={onCalendarDayPress}
            calendarActiveDateRanges={calendarActiveDateRanges}
          />

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity onPress={nextStep} style={styles.button}>
              <ThemedText style={styles.buttonText}>I don't know</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={saveOnboardingData}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>Finish</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}
      {/* Screen 3b: Average Length of Period IF the user doesn't know the last period */}
      {step === 4 && (
        <ThemedView>
          <ThemedText style={styles.header}>
            What is the average length of your period?
          </ThemedText>
          <TextInput
            style={styles.input}
            value={avgPeriodLength}
            onChangeText={setAvgPeriodLength}
            keyboardType="numeric"
          />
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={saveOnboardingData}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>I don't know</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={saveOnboardingData}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>Finish</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}
      {/* Screen 5: HealthConnect Permissions */}
      {step === 5 && (
        <ThemedView>
          <ThemedText style={styles.header}>
            Connect CycleOS to HealthConnect
          </ThemedText>
          <ThemedText>
            To provide you with the best experience, please grant CycleOS
            permissions to read your health data. We will only read your workout
            sessions, daily step count, and sleep sessions.
          </ThemedText>
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={requestHCPermission}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>Allow Access</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "#f9f9f9",
  },
  screen: {
    height: "100%",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

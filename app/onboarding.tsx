import React, { useState } from "react";
import { TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import DateRangePicker from "@/components/DateRangePicker";
import { useDateRange } from "@marceloterreiro/flash-calendar";

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [avgPeriodLength, setAvgPeriodLength] = useState("");
  const [avgCycleLength, setAvgCycleLength] = useState("");
  const [firstDayofLastPeriod, setFirstDayofLastPeriod] = useState("");

  // Go to the next step
  const nextStep = () => {
    if (step < 3) {
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


  const saveOnboardingData = () => {
    console.log("Onboarding complete:", { avgPeriodLength, avgCycleLength, dateRange });
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

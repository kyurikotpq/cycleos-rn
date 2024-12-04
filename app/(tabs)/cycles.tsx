import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Appbar, Card, Surface } from "react-native-paper";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CycleCircle } from "@/components/charts/CycleCircle";
import { fetchCycles } from "@/db/controllers/cycles";
import { router } from "expo-router";

export default function CyclesScreen() {
  const [cycles, setCycles] = useState([]);
  const [currentCycle, setCurrentCycle] = useState([]);

  const fetchData = async () => {
    // Fetch cycles from DB
    const result = await fetchCycles();

    const activeCycle = result.shift();
    if (result) {
      setCycles(result);
      setCurrentCycle(activeCycle);
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Fetch data when coming back to this screen
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content
          title={`Your Cycle History`}
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            router.navigate("/cycles/add-cycle");
          }}
        />
      </Appbar.Header>
      <ScrollView style={{ flex: 1 }}>
        {/* <Surface> is needed to establish elevation context */}
        <Surface elevation={0} style={{ padding: 20 }}>
          {currentCycle && (
            <Card mode="elevated" style={{ marginBottom: 20 }}>
              <ThemedText variant="subtitle" style={{ fontWeight: 700 }}>
                @TODO add the circle Here
              </ThemedText>
              <ThemedText>
                {currentCycle.startDate &&
                  new Date(currentCycle.startDate).toDateString().slice(4)}{" "}
                -{" "}
                {currentCycle.endDate
                  ? new Date(currentCycle.endDate).toDateString().slice(4)
                  : "??"}
              </ThemedText>
            </Card>
          )}

          <ThemedText
            variant="subtitle"
            style={{ fontWeight: 700, marginTop: 20, marginBottom: 10 }}
          >
            Previous Cycles
          </ThemedText>
          {cycles.length > 0 ? (
            cycles.map((cycle) => (
              <Card
                key={cycle.id}
                mode="elevated"
                style={{ padding: 20, marginBottom: 10 }}
              >
                <ThemedText
                  variant="defaultSemiBold"
                  style={{ marginBottom: 10 }}
                >
                  {cycle.cycleLength
                    ? `${cycle.cycleLength} days`
                    : "Unspecified number of days"}{" "}
                </ThemedText>
                <ThemedText>
                  {cycle.startDate &&
                    new Date(cycle.startDate).toDateString().slice(4)}{" "}
                  -{" "}
                  {cycle.endDate
                    ? new Date(cycle.endDate).toDateString().slice(4)
                    : "??"}
                </ThemedText>
              </Card>
            ))
          ) : (
            <ThemedText>No previous cycles yet.</ThemedText>
          )}
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

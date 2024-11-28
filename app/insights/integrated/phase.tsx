import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Dropdown from "@/components/Dropdown";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import YearHeatMap from "@/components/HeatMap/YearHeatMap";
import { Chip } from "react-native-paper";
import { HEALTH_OPTIONS, PHASE_OPTIONS } from "@/constants/Insights";

// How does one's sleep and exercise vary across the cycle?
export default function PhaseBasedInsightsScreen() {
  const [healthConstruct, setHealthConstruct] = useState<string>("");
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const handleHealthSelect = (value: string) => {
    setHealthConstruct(value);
  };
  const togglePhase = (phase: string) => {
    if (isPhaseSelected(phase)) {
      removePhase(phase);
    } else setSelectedPhases([...selectedPhases, phase]);
  };

  const removePhase = (phase: string) => {
    setSelectedPhases(selectedPhases.filter((p) => p !== phase));
  };

  const isPhaseSelected = (phase: string) =>
    selectedPhases.some((p) => p == phase);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{
          display: "flex",
          flex: 1,
          padding: 20,
        }}
      >
        <ThemedView
          style={{
            display: "flex",
            marginRight: 20,
            marginBottom: 20,
          }}
        >
          <Dropdown
            label="Health Item"
            placeholder="Health Item"
            options={HEALTH_OPTIONS}
            selectedLabel={healthConstruct}
            onSelect={handleHealthSelect}
            style={{ marginBottom: 20 }}
          />
          <ThemedView
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {PHASE_OPTIONS.map((phase) => (
              <Chip
                style={{ marginRight: 5, marginBottom: 5 }}
                onPress={() => togglePhase(phase.value)}
                selected={isPhaseSelected(phase.value)}
              >
                {phase.label}
              </Chip>
            ))}
          </ThemedView>
        </ThemedView>
        <YearHeatMap year={year} />
      </ThemedView>
    </SafeAreaView>
  );
}

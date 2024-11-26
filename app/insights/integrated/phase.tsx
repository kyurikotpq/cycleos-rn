import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Dropdown from "@/components/Dropdown";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import YearHeatMap from "@/components/HeatMap/YearHeatMap";
import { Chip } from "react-native-paper";

const HEALTH_OPTIONS = [
  { label: "Total Sleep Time (mins)", value: "sleepDuration" },
  { label: "Total Time Awake (%)", value: "totalAwake" },
  { label: "Total REM (%)", value: "totalREM" },
  { label: "Total Deep Sleep (%)", value: "totalDeep" },
  { label: "REM Latency (mins)", value: "remLatency" },
  { label: "Exercise Duration (mins)", value: "exerciseDuration" },
  { label: "Steps", value: "steps" },
];
const PHASE_OPTIONS = [
  { label: "Menstrual", value: "menstrual" },
  { label: "Follicular", value: "follicular" },
  { label: "Ovulation", value: "ovulation" },
  { label: "Early Luteal", value: "early-luteal" },
  { label: "Mid Luteal", value: "mid-luteal" },
];

export default function PhaseBasedInsightsScreen() {
  const [healthConstruct, setHealthConstruct] = useState<string>("");
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [heatMapWidthHeight, setHeatMapWidthHeight] = useState({
    width: 0,
    height: 0,
  });
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
          {/* Maybe should use Chip instead, takes up too much screen space */}
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

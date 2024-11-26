import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Dropdown from "@/components/Dropdown";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import YearHeatMap from "@/components/HeatMap/YearHeatMap";

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
  const [phase, setPhase] = useState<string>("");
  const [heatMapWidthHeight, setHeatMapWidthHeight] = useState({
    width: 0,
    height: 0,
  });
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const handleHealthSelect = (value: string) => {
    setHealthConstruct(value);
  };
  const handlePhaseSelect = (value: string) => {
    setPhase(value);
  };


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
            maxWidth: "50%",
            marginRight: 20,
            marginBottom: 20
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
          <Dropdown
            label="Menstrual Phase"
            placeholder="Phase"
            options={PHASE_OPTIONS}
            selectedLabel={phase}
            onSelect={handlePhaseSelect}
          />
        </ThemedView>
        <YearHeatMap year={year} />
      </ThemedView>
    </SafeAreaView>
  );
}

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Dropdown from "@/components/Dropdown";
import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import YearHeatMap from "@/components/HeatMap/YearHeatMap";
import { Chip } from "react-native-paper";
import { HEALTH_OPTIONS, PHASE_OPTIONS } from "@/constants/Insights";
import FlexScatterplot from "@/components/charts/FlexScatterplot";

export default function CorrelationInsightsScreen() {
  const [xKey, setXKey] = useState<string>("");
  const [yKey, setYKey] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const handleXKeySelect = (value: string) => {
    setXKey(value);
  };
  const handleYKeySelect = (value: string) => {
    setYKey(value);
  };

  const DATA = [
    { x: 0, y: 2, color: "red" },
    { x: 0, y: 1, color: "red" },
    { x: 1, y: 1, color: "red" },
    { x: 0, y: 2, color: "red" },
    { x: 0, y: 2, color: "red" },
    { x: 2, y: 3, color: "blue" },
    { x: 3, y: 9, color: "green" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{
          padding: 20,
          flex: 1,
          backgroundColor: "#000",
        }}
      >
        <Dropdown
          label="Health Item"
          placeholder="Health Item"
          options={HEALTH_OPTIONS}
          selectedLabel={xKey}
          onSelect={handleXKeySelect}
          style={{ marginBottom: 20 }}
        />
        <FlexScatterplot
          data={DATA}
          xKey="x"
          yKey="y"
          colorKey="color"
          xMin={0}
          colorMap={{
            red: { color: "red", label: "Red" },
            blue: { color: "blue", label: "Blue" },
            green: { color: "green", label: "Green" },
          }}
          title="Correlation"
        />
        <Dropdown
          label="Health Item"
          placeholder="Health Item"
          options={HEALTH_OPTIONS}
          selectedLabel={xKey}
          onSelect={handleXKeySelect}
          style={{ marginBottom: 20 }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

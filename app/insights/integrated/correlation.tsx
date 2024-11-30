import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Dropdown from "@/components/Dropdown";
import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { HEALTH_OPTIONS, PHASE_COLOR_MAP } from "@/constants/Insights";
import FlexScatterplot from "@/components/charts/FlexScatterplot";
import ThemedLegend from "@/components/charts/ThemedLegend";

export default function CorrelationInsightsScreen() {
  const CURRENT_YEAR = new Date().getFullYear();
  const [xKey, setXKey] = useState<string>("");
  const [yKey, setYKey] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    CURRENT_YEAR.toString()
  );
  const [YEAR_OPTIONS, setYearOptions] = useState([
    { label: CURRENT_YEAR.toString(), value: CURRENT_YEAR.toString() },
  ]);

  const handleXKeySelect = (value: string) => {
    setXKey(value);
  };
  const handleYKeySelect = (value: string) => {
    setYKey(value);
  };

  const handleYearSelect = (value: string) => {
    setSelectedYear(value);
    // Filter data based on year
  };

  const DATA = [
    { x: 0, y: 2, color: "red" },
    { x: 0, y: 1, color: "red" },
    { x: 1, y: 1, color: "red" },
    { x: 0, y: 2, color: "red" },
    { x: 0, y: 2, color: "red" },
    { x: 2, y: 3, color: "blue" },
    { x: 3, y: 4 / 3, color: "green" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{
          padding: 20,
          flex: 1,
          // backgroundColor: "#000",
        }}
      >
        <ThemedView
          style={{display: "flex", flexDirection: "row" }}
        >
          <Dropdown
            label="Health Item"
            placeholder="Select Y-Axis Health Item"
            options={HEALTH_OPTIONS}
            selectedLabel={xKey}
            onSelect={handleXKeySelect}
            style={{ marginRight: 10 }}
          />
          <Dropdown
            label="Year"
            placeholder="Select Year"
            options={YEAR_OPTIONS}
            selectedLabel={selectedYear}
            onSelect={handleYearSelect}
          />
        </ThemedView>
        <FlexScatterplot
          data={DATA}
          xKey="x"
          yKey="y"
          colorKey="color"
          xMin={0}
          colorMap={PHASE_COLOR_MAP}
          title="Correlation"
        />
        <Dropdown
          label="Health Item"
          placeholder="Select X-Axis Health Item"
          options={HEALTH_OPTIONS.filter((option) => option.value !== xKey)}
          selectedLabel={xKey}
          onSelect={handleXKeySelect}
          style={{ marginBottom: 20 }}
        />
        <ThemedLegend colorMap={PHASE_COLOR_MAP} legendTitle="Legend" />
      </ThemedView>
    </SafeAreaView>
  );
}

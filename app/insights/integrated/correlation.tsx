import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { HEALTH_OPTIONS, PHASE_COLOR_MAP } from "@/constants/InsightsOptions";
import FlexScatterplot from "@/components/charts/FlexScatterplot";
import ThemedLegend from "@/components/charts/ThemedLegend";
import { getInsightsForYear } from "@/db/controllers/insights";

export default function CorrelationInsightsScreen() {
  const CURRENT_YEAR = new Date().getFullYear();
  const [xKey, setXKey] = useState<string>(HEALTH_OPTIONS[0].value);
  const [yKey, setYKey] = useState<string>(HEALTH_OPTIONS[1].value);
  const [xLabel, setXLabel] = useState<string>(HEALTH_OPTIONS[0].label);
  const [yLabel, setYLabel] = useState<string>(HEALTH_OPTIONS[1].label);

  const [filteredXOptions, setFilteredXOptions] = useState(
    HEALTH_OPTIONS.filter((option) => option.value !== yKey)
  );
  const [filteredYOptions, setFilteredYOptions] = useState(
    HEALTH_OPTIONS.filter((option) => option.value !== xKey)
  );

  const [selectedYear, setSelectedYear] = useState<string>(
    CURRENT_YEAR.toString()
  );
  const [YEAR_OPTIONS, setYearOptions] = useState([
    { label: CURRENT_YEAR.toString(), value: CURRENT_YEAR.toString() },
  ]);
  // A whole year's worth of data, for all health items
  const [yearData, setYearData] = useState<any[]>([]);

  const handleXKeySelect = (option: any) => {
    setXKey(option.value);
    setXLabel(option.label);
    setFilteredYOptions(
      HEALTH_OPTIONS.filter((o) => o.value !== option.value)
    );
  };
  const handleYKeySelect = (option: any) => {
    setYKey(option.value);
    setYLabel(option.label);
    setFilteredXOptions(
      HEALTH_OPTIONS.filter((o) => o.value !== option.value)
    );
  };

  const handleYearSelect = (option: any) => {
    setSelectedYear(option.value);
  };

  const getDataForYear = async (year: string) => {
    const data = await getInsightsForYear(year);
    setYearData(data);
  };


  useEffect(() => {
    getDataForYear(selectedYear);
  }, [selectedYear]);

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{
          padding: 20,
          flex: 1,
          // backgroundColor: "#000",
        }}
      >
        {/* Controls for the scatterplot */}
        <ThemedView style={{ display: "flex", flexDirection: "row" }}>
          <Dropdown
            label="Health Item"
            placeholder="Select Y-Axis Health Item"
            options={filteredYOptions}
            selectedLabel={yLabel}
            onSelect={handleYKeySelect}
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
          data={yearData}
          xKey={xKey}
          yKey={yKey}
          colorKey="phase"
          xMin={0}
          colorMap={PHASE_COLOR_MAP}
          title="Correlation"
        />
        <Dropdown
          label="Health Item"
          placeholder="Select X-Axis Health Item"
          options={filteredXOptions}
          selectedLabel={xLabel}
          onSelect={handleXKeySelect}
          style={{ marginBottom: 20 }}
        />
        <ThemedLegend colorMap={PHASE_COLOR_MAP} legendTitle="Legend" />
      </ThemedView>
    </SafeAreaView>
  );
}

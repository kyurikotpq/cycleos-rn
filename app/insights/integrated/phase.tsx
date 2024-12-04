import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Dropdown, { DropdownOption } from "@/components/Dropdown";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import YearHeatMap from "@/components/HeatMap/YearHeatMap";
import { Chip } from "react-native-paper";
import { HEALTH_OPTIONS, PHASE_OPTIONS, PHASE_BG_MAP } from "@/constants/InsightsOptions";
import { getInsightsForYear } from "@/db/controllers/insights";

// How does one's sleep and exercise vary across the cycle?
export default function PhaseBasedInsightsScreen() {
  const CURRENT_YEAR = new Date().getFullYear();

  const [selectedHealthConstruct, setSelectedHealthConstruct] =
    useState<DropdownOption | null>(HEALTH_OPTIONS[0]);
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    CURRENT_YEAR.toString()
  );
  const [YEAR_OPTIONS, setYearOptions] = useState([
    { label: CURRENT_YEAR.toString(), value: CURRENT_YEAR.toString() },
  ]);
  // A whole year's worth of data, for all health items
  // KEYED BY dayId
  const [yearData, setYearData] = useState<any>(null);

  const handleHealthSelect = (option: DropdownOption) => {
    setSelectedHealthConstruct(option);
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

  const getDataForYear = async (year: string) => {
    const data = await getInsightsForYear(year);

    // Key data by the date (dayId)
    const finalData: { [key: string]: any } = {};
    data.forEach((record: any) => {
      finalData[record.dayId] = record;
    });
    setYearData(finalData);
  };

  useEffect(() => {
    getDataForYear(selectedYear);
  }, [selectedYear]);

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
            placeholder="Select Health Item"
            options={HEALTH_OPTIONS}
            selectedLabel={selectedHealthConstruct?.label}
            onSelect={handleHealthSelect}
            style={{ marginBottom: 20 }}
          />
          <ThemedView
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {PHASE_OPTIONS.map((phase) => (
              <Chip
                key={phase.value}
                style={{ marginRight: 5, marginBottom: 5 }}
                onPress={() => togglePhase(phase.value)}
                selected={isPhaseSelected(phase.value)}
              >
                {phase.label}
              </Chip>
            ))}
          </ThemedView>
        </ThemedView>
        <YearHeatMap
          year={selectedYear}
          data={yearData}
          colorKey={selectedHealthConstruct?.value}
          cellBGImgMapping={PHASE_BG_MAP}
          cellBGImgKey="phase"
        />
      </ThemedView>
    </SafeAreaView>
  );
}

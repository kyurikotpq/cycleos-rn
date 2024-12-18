import { Cycle } from "@/db/schema";
import { Card } from "react-native-paper";
import { ThemedText } from "../ThemedText";
import { useEffect, useState } from "react";
import { MoreOptionsMenu } from "../navigation/MoreOptionsMenu";
import { DropdownOption } from "../Dropdown";
import { CycleOSTheme } from "@/constants/Theme";

interface CycleCardProps {
  cycle: Cycle;
  isCurrentCycle?: boolean;
  onEditOrDelete: (action: string, cycle: Cycle) => void;
}

const EDIT_OR_DELETE_OPTIONS: DropdownOption[] = [
  { label: "Edit Cycle", value: "edit", icon: "pencil" },
  {
    label: "Delete Cycle",
    value: "delete",
    icon: "trash-can",
    color: CycleOSTheme.colors.errorContainer,
  },
];

export default function CycleCard({
  cycle,
  isCurrentCycle,
  onEditOrDelete,
}: CycleCardProps) {
  const [cardTitle, setCardTitle] = useState("Current Cycle");

  const handleEditOrDelete = (option: any) => {
    onEditOrDelete(option.value, cycle);
  };

  useEffect(() => {
    const finalCardTitle =
      cycle.startDate && cycle.endDate
        ? new Date(cycle.startDate).toDateString().slice(4) +
          " - " +
          `${new Date(cycle.endDate).toDateString().slice(4)} ${
            isCurrentCycle ? "(predicted)" : ""
          }`
        : "Invalid date range";

    setCardTitle(finalCardTitle);
  }, []);

  return (
    <Card
      mode={isCurrentCycle ? "elevated" : "contained"}
      style={{ marginBottom: 10 }}
    >
      <Card.Title
        title={cardTitle}
        titleStyle={{ fontWeight: "bold", marginBottom: 0 }}
        right={() => (
          <MoreOptionsMenu
            options={EDIT_OR_DELETE_OPTIONS}
            onSelect={handleEditOrDelete}
          />
        )}
      />
      <Card.Content>
        <ThemedText>
          Period: {cycle.periodLength
            ? `${cycle.periodLength} days`
            : "Unspecified number of days"}
        </ThemedText>
        <ThemedText>
          Cycle Length: {cycle.cycleLength
            ? `${cycle.cycleLength} days ${isCurrentCycle ? "(predicted)" : ""}`
            : "Unspecified number of days"}
        </ThemedText>
      </Card.Content>
    </Card>
  );
}

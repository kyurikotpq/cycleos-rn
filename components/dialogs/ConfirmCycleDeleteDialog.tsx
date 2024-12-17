import { Dialog, Button } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { Cycle } from "@/db/schema";
import { CycleOSTheme } from "@/constants/Theme";

interface ConfirmCycleDeleteDialogProps {
  cycle: Cycle;
  visible: boolean;
  onDismiss: (confirm: boolean) => void;
}
export default function ConfirmCycleDeleteDialog({
  cycle,
  visible,
  onDismiss,
}: ConfirmCycleDeleteDialogProps) {
  return (
    <Dialog visible={visible} onDismiss={() => onDismiss(false)}>
      <Dialog.Title>Are you sure you want to delete this cycle?</Dialog.Title>
      <Dialog.Content>
        <ThemedText variant="default" style={{ marginBottom: 20 }}>
          Your health data will not be erased, but the dates in this cycle (
          {cycle?.startDate
            ? new Date(cycle.startDate).toDateString().slice(4)
            : "Unknown start date"}{" "}
          -{" "}
          {cycle?.endDate
            ? new Date(cycle.endDate).toDateString().slice(4)
            : "Unknown end date"}
          ) will not be tagged with any menstrual phase.
        </ThemedText>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => onDismiss(false)}
          style={{ marginRight: "auto" }}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          buttonColor={CycleOSTheme.colors.error}
          onPress={() => onDismiss(true)}
        >
          Yes, Delete This Cycle
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

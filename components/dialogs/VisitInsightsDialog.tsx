import { Dialog, Button } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";

interface VisitInsightsDialogProps {
  visible: boolean;
  onDismiss: (confirm: boolean) => void;
}
export default function VisitInsightsDialog({
  visible,
  onDismiss,
}: VisitInsightsDialogProps) {
  return (
    <Dialog visible={visible} onDismiss={() => onDismiss(false)}>
      <Dialog.Title>Thanks for logging your symptoms!</Dialog.Title>
      <Dialog.Content>
        <ThemedText variant="default" style={{ marginBottom: 20 }}>
          Would you like to see your insights now?
        </ThemedText>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => onDismiss(false)} style={{ marginRight: "auto" }}>No</Button>
        <Button onPress={() => onDismiss(true)}>Yes</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

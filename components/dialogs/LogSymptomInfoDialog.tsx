import { Dialog, Button, DialogProps } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";

export default function LogSymptomInfoDialog({
  visible,
  onDismiss,
}: DialogProps) {
  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Log all of your symptoms!</Dialog.Title>
      <Dialog.Content>
        <ThemedText variant="default" style={{ marginBottom: 20 }}>
          If you already checked some symptoms earlier today,{" "}
          <ThemedText variant="defaultSemiBold">don't uncheck them</ThemedText>
          —even if you stopped experiencing those symptoms later in the day.
        </ThemedText>

        <ThemedText variant="default">
          Instead,{" "}
          <ThemedText variant="defaultSemiBold">
            add any new symptoms
          </ThemedText>{" "}
          that you're experiencing now. CycleOS tracks the time you log your
          symptoms so you can always look back to see how they change throughout
          the day.
        </ThemedText>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>OK, Got It!</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

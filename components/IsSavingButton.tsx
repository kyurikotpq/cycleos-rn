import { useEffect, useState } from "react";
import { Button } from "react-native-paper";

interface IsSavingButtonProps {
  onPressCB: any;
  saveState: string; // "Save" | "Saving..." | "Saved!"
}

export default function IsSavingButton({
  onPressCB,
  saveState,
}: IsSavingButtonProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    setIsDisabled(saveState != "Save");
  }, [saveState]);

  return (
    <Button
      mode="contained"
      style={{
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
      }}
      icon={saveState == "Saved!" ? "check" : undefined}
      disabled={isDisabled}
      onPress={onPressCB}
    >
      {saveState}
    </Button>
  );
}

import { useState } from "react";
import { Pressable } from "react-native";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";
import { Menu } from "react-native-paper";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { CycleOSTheme } from "@/constants/Theme";

export interface DropdownOption {
  label: string;
  value: string;
}
interface DropdownInputProps {
  placeholder?: string;
  label?: TextInputLabelProp;
  selectedLabel?: string;
  mode?: "flat" | "outlined";
  disabled?: boolean;
  error?: boolean;
  onSelect: (option: DropdownOption) => void;
  options: DropdownOption[];
  style?: any;
}

export default function DropdownInput({
  placeholder,
  label,
  style,
  selectedLabel,
  mode,
  disabled = false,
  error,
  onSelect,
  options,
}: DropdownInputProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <Pressable
      style={{
        ...style,
        paddingTop: 20,
        paddingRight: 44,
        paddingBottom: 20,
        paddingLeft: 16,
        backgroundColor: CycleOSTheme.colors.secondaryContainer,
        color: CycleOSTheme.colors.onSecondaryContainer,
        borderBottomWidth: 1,
      }}
      onLayout={(event) => {
        // https://stackoverflow.com/a/74544946/11620221
        // x & y are relative to parent, pageX & pageY are relative to screen
        // @TODO: This doesn't work if the parent is on the right side of the screen
        event.target.measure((x, y, width, height, pageX, pageY) => {
          setAnchorPosition({ x: pageX, y: pageY + height });
        });
      }}
      onPress={() => setShowMenu(true)}
    >
      <ThemedText variant="default">
        {!selectedLabel ? placeholder :  selectedLabel}
      </ThemedText>
      <Ionicons
        name="caret-down"
        size={20}
        color="black"
        style={{ position: "absolute", right: 15, top: 23 }}
      />
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={anchorPosition}
      >
        {options.map((option: DropdownOption) => (
          <Menu.Item
            key={option.value}
            onPress={() => {
              onSelect(option);
              setShowMenu(false);
            }}
            title={option.label}
          />
        ))}
      </Menu>
    </Pressable>
  );
}

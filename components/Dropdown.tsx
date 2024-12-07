import { useRef, useState } from "react";
import { View, Pressable } from "react-native";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";
import { Menu, TextInput } from "react-native-paper";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

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
        paddingTop: 10,
        paddingRight: 44,
        paddingBottom: 10,
        paddingLeft: 16,
        backgroundColor: "#e0e0e0",
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
        style={{ position: "absolute", right: 10, top: "48%" }}
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

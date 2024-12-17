import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { DropdownOption } from "../Dropdown";

interface MoreOptionsMenuProps {
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
}

export function MoreOptionsMenu({ options, onSelect }: MoreOptionsMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Menu
      visible={showMenu}
      onDismiss={() => setShowMenu(false)}
      anchor={
        <IconButton
          icon="dots-vertical"
          size={20}
          onPress={() => setShowMenu(!showMenu)}
        />
      }
      anchorPosition="bottom"
    >
      {options.map((option: DropdownOption) => (
        <Menu.Item
          key={option.value}
          onPress={() => {
            onSelect(option);
            setShowMenu(false);
          }}
          title={option.label}
          leadingIcon={option.icon}
          rippleColor={option.color}
        />
      ))}
    </Menu>
  );
}

import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { CycleOSTheme } from "@/constants/Theme";

interface HeatmapColorBarProps {
  min: number;
  max: number;
  color: string;
  numTicks?: number;
  style?: any;
}
export default function HeatmapColorBar({
  min,
  max,
  color,
  numTicks = 7,
  style,
}: HeatmapColorBarProps) {
  const CELL_SIZE = 15;
  const CELL_SPACING = 2;

  return (
    <View style={{ ...style, alignItems: "center" }}>
      <ThemedText
        style={{
          fontSize: CELL_SIZE * 0.8,
          lineHeight: CELL_SIZE * 0.8,
        }}
      >
        {min < Infinity && Math.round(min)}
      </ThemedText>
      {Array.from({ length: numTicks }).map((_, i) => (
        <View
          key={i}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: `${color}, ${i / numTicks + 0.05})`,
            marginBottom: CELL_SPACING,
            borderWidth: i == 0 ? 1 : 0,
          }}
        />
      ))}
      <ThemedText
        style={{
          fontSize: CELL_SIZE * 0.8,
          lineHeight: CELL_SIZE * 0.8,
          marginTop: CELL_SPACING,
        }}
      >
        {max > 0 && Math.round(max)}
      </ThemedText>
    </View>
  );
}

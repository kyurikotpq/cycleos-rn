import { Avatar, Card, Chip } from "react-native-paper";
import { ThemedText } from "../ThemedText";

interface ThemedLegendProps {
  colorMap: { [key: string]: { color: string; label: string } };
  legendTitle?: string;
}

export default function ThemedLegend({
  colorMap,
  legendTitle,
}: ThemedLegendProps) {
  return (
    <Card mode="contained">
      <Card.Content
        style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        <ThemedText
          variant="defaultSemiBold"
          style={{ marginRight: 10, width: "100%" }}
        >
          {legendTitle ?? "Legend"}
        </ThemedText>
        {Object.entries(colorMap).map(([key, { color, label }]) => (
          <Chip
            compact={true}
            key={key}
            avatar={
              <Avatar.Text
                style={{ backgroundColor: color, width: 10, height: 10 }}
                label=""
              />
            }
            style={{ backgroundColor: "transparent", marginRight: 10 }}
          >
            {label}
          </Chip>
        ))}
      </Card.Content>
    </Card>
  );
}

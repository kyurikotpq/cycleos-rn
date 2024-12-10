import { Avatar, Card, Chip } from "react-native-paper";
import { ThemedText } from "../ThemedText";
import { ImageBackground, View } from "react-native";
import { CycleOSTheme } from "@/constants/Theme";

interface ThemedLegendProps {
  colorMap?: { [key: string]: { color: string; label: string } };
  bgImgMap?: { [key: string]: any };
  legendTitle?: string;
}

export default function ThemedLegend({
  colorMap,
  bgImgMap,
  legendTitle,
}: ThemedLegendProps) {
  return (
    <Card mode="contained">
      <Card.Content
        style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        <ThemedText
          variant="defaultSemiBold"
          style={{
            marginRight: 10,
            marginBottom: colorMap ? 0 : 10,
            width: "100%",
          }}
        >
          {legendTitle ?? "Legend"}
        </ThemedText>
        {/* @TODO: Make the Chips Selectable */}
        {colorMap &&
          Object.entries(colorMap).map(([key, { color, label }]) => (
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
        {bgImgMap &&
          Object.entries(bgImgMap).map(([key, { img, label }]) => (
            <Chip
              compact={true}
              key={key}
              avatar={
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderColor: CycleOSTheme.colors.outline,
                    borderRadius: 0,
                    borderWidth: 1,
                  }}
                >
                  {img && (
                    <ImageBackground
                      source={img}
                      resizeMode="contain"
                      style={{
                        width: 17,
                        height: 17,
                      }}
                    />
                  )}
                </View>
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

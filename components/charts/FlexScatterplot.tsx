import { ScrollView, View } from "react-native";
import {
  Canvas,
  Circle,
  Text,
  Line,
  Group,
  useFont,
  matchFont,
  useFonts,
} from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { Avatar, Card, Chip } from "react-native-paper";
import { ThemedText } from "../ThemedText";

interface ScatterplotProps {
  data: any[]; // array of objects with at least `xKey`, `yKey`, and `colorKey
  xKey: string;
  yKey: string;
  colorKey: string; // The key to use for colors

  // Axis limits
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;

  numXTicks?: number;
  numYTicks?: number;
  style?: any;

  // e.g. { "menstrual": { color: "red", "label": "Menstrual"}, ... }
  // Should have a "default" key (with color and label values) for the default color
  colorMap: { [key: string]: { color: string; label: string } };
  title: string;
  radius?: number; // Radius of the data points
}

export default function FlexScatterplot({
  data,
  xKey,
  yKey,
  colorKey,
  colorMap,
  radius = 10,
  xMin = 0,
  xMax,
  yMin = 0,
  yMax,

  numYTicks = 10,
  numXTicks = 10,

  style,
  // @TODO
  title,
}: ScatterplotProps) {
  const [height, setHeight] = useState(300); // Canvas width
  const padding = 40; // Padding around the plot area
  const FONT_SIZE = 14;

  // Define axis limits based on data if not provided
  const xValues = data.map((d) => d[xKey]);
  const yValues = data.map((d) => d[yKey]);
  if (xMin == undefined) xMin = Math.min(...xValues);
  if (xMax == undefined) xMax = Math.max(...xValues);
  if (yMin == undefined) yMin = Math.min(...yValues);
  if (yMax == undefined) yMax = Math.max(...yValues);

  const [originX, setOriginX] = useState(padding + `${yMax}`.length * 1.5);

  const [xTickSpacing, setXTickSpacing] = useState(
    `${xMax}`.length * (FONT_SIZE / 1.5)
  );
  const [canvasWidth, setCanvasWidth] = useState(
    numXTicks * xTickSpacing + 2 * padding + originX
  );

  // Helper function to scale data points to canvas size
  const scaleX = (value: number) =>
    ((value - xMin) / (xMax - xMin)) * (canvasWidth - 2 * padding) + originX;
  const scaleY = (value: number) =>
    height -
    (((value - yMin) / (yMax - yMin)) * (height - 2 * padding) + padding);

  // Function to render different shapes
  const renderShape = (x: number, y: number, color: string, key: string) => {
    return (
      <Circle
        key={key}
        cx={x}
        cy={y}
        r={radius / 2}
        color={color}
        opacity={0.7}
      />
    );
  };

  // Ticks
  const getTicks = (min: number, max: number, numTicks: number) => {
    const step = (max - min) / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => min + i * step);
  };

  // @TODO: Update fonts later
  const fontMgr = useFonts({
    Roboto: [require("@/assets/fonts/SpaceMono-Regular.ttf")],
  });
  if (!fontMgr) {
    return null;
  }

  const fontStyle = {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: FONT_SIZE,
  } as const;
  const font = matchFont(fontStyle, fontMgr);

  return (
    <View style={{ ...style, flex: 1 }}>
      <ScrollView
        horizontal={true}
        style={{
          marginBottom: 10,
          flex: 1,
        }}
        // Resize the canvas to fit the available height
        onLayout={(event) => {
          event.target.measure((x, y, width, height, pageX, pageY) => {
            setHeight(height);
          });
        }}
      >
        <Canvas style={{ flex: 1, width: canvasWidth }}>
          {/* Draw Y-Axis */}
          <Line
            p1={{ x: originX, y: padding - 10 }}
            p2={{ x: originX, y: height - padding }}
            color="black"
            strokeWidth={2}
          />
          {/* Draw X-Axis */}
          <Line
            p1={{ x: originX, y: height - padding }}
            p2={{ x: canvasWidth - 10, y: height - padding }}
            color="black"
            strokeWidth={2}
          />

          {/* X-axis ticks and labels */}
          {getTicks(xMin, xMax, numXTicks).map((tick, index) => {
            const x = scaleX(tick);
            return (
              <Group key={`x-axis-tick-${index}`}>
                <Line
                  key={`x-tick-${index}`}
                  p1={{ x, y: height - padding }}
                  p2={{ x, y: height - padding + 7 }}
                  color="black"
                  strokeWidth={2}
                />
                <Text
                  key={`x-tick-label-${index}`}
                  x={x - FONT_SIZE / 3}
                  y={height - padding / 3}
                  text={tick.toFixed(1)}
                  color="black"
                  font={font}
                />
              </Group>
            );
          })}

          {/* Y-axis ticks and labels */}
          {getTicks(yMin, yMax, numYTicks).map((tick, index) => {
            const y = scaleY(tick);
            return (
              <Group key={`y-axis-tick-${index}`}>
                <Line
                  key={`y-tick-${index}`}
                  p1={{ x: originX - 7, y }}
                  p2={{ x: originX, y }}
                  color="black"
                  strokeWidth={2}
                />
                <Text
                  key={`y-tick-label-${index}`}
                  x={0}
                  y={y + FONT_SIZE / 3}
                  text={tick.toFixed(1)}
                  color="#000"
                  font={font}
                />
              </Group>
            );
          })}

          {/* Render data points */}
          {xKey &&
            yKey &&
            data?.map((point, index) => {
              const x = scaleX(point[xKey]);
              const y = scaleY(point[yKey]);
              const color =
                colorMap[point[colorKey]]?.color || colorMap.default.color;
              return renderShape(x, y, color, `p-${color}-${index}`);
            })}
        </Canvas>
      </ScrollView>
    </View>
  );
}

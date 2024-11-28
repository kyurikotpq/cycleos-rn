import { View } from "react-native";
import {
  Canvas,
  Circle,
  Text,
  Line,
  useFont,
  matchFont,
  useFonts,
} from "@shopify/react-native-skia";
import { useState } from "react";

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

  // e.g. { "menstrual": { color: "red", "label": "Menstrual"}, ... }
  colorMap: { [key: string]: { color: string; label: string } };
  title: string;

  radius?: number;
  legend?: boolean;
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

  // @TODO
  title,
  legend,
}: ScatterplotProps) {
  const [width, setWidth] = useState(300); // Canvas width
  const [height, setHeight] = useState(300); // Canvas width
  const [dimensions, setDimensions] = useState({ width, height });
  const padding = 40; // Padding around the plot area
  const FONT_SIZE = 16;

  // Define axis limits based on data if not provided
  const xValues = data.map((d) => d[xKey]);
  const yValues = data.map((d) => d[yKey]);
  if (xMin == undefined) xMin = Math.min(...xValues);
  if (xMax == undefined) xMax = Math.max(...xValues);
  if (yMin == undefined) yMin = Math.min(...yValues);
  if (yMax == undefined) yMax = Math.max(...yValues);

  // Helper function to scale data points to canvas size
  const scaleX = (value: number) =>
    ((value - xMin) / (xMax - xMin)) * (width - 2 * padding) + padding;
  const scaleY = (value: number) =>
    height -
    (((value - yMin) / (yMax - yMin)) * (height - 2 * padding) + padding);

  // Function to render different shapes
  const renderShape = (x: number, y: number, color: string, key: string) => {
    return <Circle key={key} cx={x} cy={y} r={radius / 2} color={color} />;
  };

  // Ticks
  const xTicks = 5; // Number of x-axis ticks
  const yTicks = 5; // Number of y-axis ticks
  const getTicks = (min: number, max: number, numTicks: number) => {
    const step = (max - min) / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => min + i * step);
  };

  // Extract unique, sorted values for axes
  const uniqueSortedX = [...new Set(data.map((d) => d[xKey]))].sort(
    (a, b) => a - b
  );
  const uniqueSortedY = [...new Set(data.map((d) => d[yKey]))].sort(
    (a, b) => a - b
  );

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
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#eee" }}
      onLayout={(event) => {
        event.target.measure((x, y, width, height, pageX, pageY) => {
          setWidth(width);
          setHeight(height);
          setDimensions({ width, height });
        });
      }}
    >
      <Canvas style={{ flex: 1 }}>
        {/* Draw X and Y axes */}
        <Line
          p1={{ x: padding, y: padding - 10 }}
          p2={{ x: padding, y: height - padding }}
          color="black"
          strokeWidth={2}
        />
        <Line
          p1={{ x: padding, y: height - padding }}
          p2={{ x: width - padding + 10, y: height - padding }}
          color="black"
          strokeWidth={2}
        />

        {/* X-axis ticks and labels */}
        {uniqueSortedX.map((tick, index) => {
          const x = scaleX(tick);
          return (
            <>
              <Line
                key={`x-tick-${index}`}
                p1={{ x, y: height - padding }}
                p2={{ x, y: height - padding + 7 }}
                color="black"
                strokeWidth={2}
              />
              <Text
                x={x - (FONT_SIZE / 3)}
                y={height - (padding / 3)}
                text={tick.toString()}
                color="black"
                font={font}
              />
            </>
          );
        })}

        {/* Y-axis ticks and labels */}
        {uniqueSortedY.map((tick, index) => {
          const y = scaleY(tick);
          return (
            <>
              <Line
                key={`y-tick-${index}`}
                p1={{ x: padding - 7, y }}
                p2={{ x: padding, y }}
                color="black"
                strokeWidth={2}
              />
              <Text
                x={padding / 3}
                y={y + (FONT_SIZE / 3)}
                text={tick.toString()}
                color="#000"
                font={font}
              />
            </>
          );
        })}

        {/* Render data points */}
        {data.map((point, index) => {
          const x = scaleX(point[xKey]);
          const y = scaleY(point[yKey]);
          const color = colorMap[point[colorKey]]?.color || "grey";
          return renderShape(x, y, color, index);
        })}
      </Canvas>
    </View>
  );
}

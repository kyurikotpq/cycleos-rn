import React from "react";
import { View } from "react-native";
import {
  Skia,
  Canvas,
  Rect,
} from "@shopify/react-native-skia";

// Define the SleepStageData type
interface SleepStageData {
  stage: "Awake" | "REM" | "Light" | "Deep";
  startTime: number; // Time in minutes since the start of the session
  duration: number; // Duration in minutes
}

// Example sleep data
const sleepData: SleepStageData[] = [
  { stage: "Awake", startTime: 0, duration: 28 },
  { stage: "REM", startTime: 30, duration: 95 },
  { stage: "Light", startTime: 125, duration: 233 },
  { stage: "Deep", startTime: 360, duration: 86 },
  // Add more data points as needed
];

// Sleep stage colors
const stageColors: { [key: string]: string } = {
  Awake: "#FF4B4B",
  REM: "#62A9FF",
  Light: "#90CFFF",
  Deep: "#1C68D3",
};

// Graph dimensions
const GRAPH_WIDTH = 350;
const GRAPH_HEIGHT = 200;
const TOTAL_DURATION = 480; // Total duration of the sleep session in minutes (e.g., 8 hours)

const SleepStagesGraph: React.FC = () => {
  return (
    <View>
      <Canvas
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
          backgroundColor: "#1A1A2E",
        }}
      >
        {sleepData.map((d, index) => {
          const x = (d.startTime / TOTAL_DURATION) * GRAPH_WIDTH;
          const width = (d.duration / TOTAL_DURATION) * GRAPH_WIDTH;
          const y = index * (GRAPH_HEIGHT / sleepData.length);
          const height = GRAPH_HEIGHT / sleepData.length;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              color={stageColors[d.stage]}
            />
          );
        })}
      </Canvas>
    </View>
  );
};

export default SleepStagesGraph;
import dayjs from "dayjs";
import InteractiveHeatmap from "./InteractiveHeatmap";
import { useEffect, useState } from "react";
import { Text } from "react-native";

type HeatmapCell = {
  id: string;
  date: string | null; // Null for padding cells
  text: string | null;
  opacityValue?: number; // Optional value for the heatmap intensity
  borderColor?: string;
  backgroundImage?: string;
};

type HeatmapData = {
  [key: string]: {
    phase: string;
    sleepDuration: number;
    avgAwake: number;
    avgRem: number;
    avgDeep: number;
    avgRemLatency: number;
    exerciseDuration: number;
    steps: number;
    symptoms: number;
  };
};

interface YearHeatMapProps {
  data: HeatmapData;
  year: string;
  colorKey?: string;
  cellBGImgMapping?: { [key: string]: string }; // Mapping of cell values to background image paths
  cellBGImgKey?: string; // The key in `data` to use for cell background images. Must exist in `cellBGImgMapping`
}

export default function YearHeatMap({
  data,
  year,
  colorKey,
  cellBGImgMapping,
  cellBGImgKey,
}: YearHeatMapProps) {
  const dayLabels = ["SUN", "", "", "WED", "", "", "SAT"];
  const [days, setDays] = useState<HeatmapCell[]>([]);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [monthLabels, setMonthLabels] = useState<string[]>([]);

  const calculateHeatmapData = () => {
    const firstDayOfYear = dayjs(`${year}-01-01`);
    const lastDayOfYear = dayjs(`${parseInt(year) + 1}-01-01`);
    const offset = firstDayOfYear.day();
    setOffsetX(offset); // Offset for the first row

    let all_days: HeatmapCell[] = [];
    let all_month_labels: string[] = [];
    let currentDate = firstDayOfYear;
    let numDays = 0;

    while (currentDate.isBefore(lastDayOfYear, "day")) {
      // @TODO: Add data coloring, currently it's monochrome
      // There should be a better separation between the days and the data coloring
      const dayId = currentDate.format("YYYY-MM-DD");

      all_days.push({
        id: dayId,
        date: dayId,
        text: currentDate.format("D") == "1" ? currentDate.format("D") : null,
      });

      // Check if the current week starts and end in the same month
      // (Our week starts on Sunday)
      if (currentDate.day() == 0 || numDays == 0) {
        const month = currentDate.month();
        const endOfWeek = currentDate.endOf("week");

        if (month != endOfWeek.month() || currentDate.date() == 1)
          all_month_labels.push(endOfWeek.format("MMM"));
        else all_month_labels.push("");
      }

      currentDate = currentDate.add(1, "day");
      numDays++;
    }

    setDays(all_days);
    setMonthLabels(all_month_labels);
  };

  useEffect(() => {
    calculateHeatmapData();
  }, [year]);

  return (
    <InteractiveHeatmap
      matrix={days}
      data={data}
      dataMatrixKey="date"
      colorKey={colorKey ?? ""}
      numColumns={7}
      xLabels={dayLabels}
      yLabels={monthLabels}
      offsetX={offsetX}
      cellBGImgMapping={cellBGImgMapping}
      cellBGImgKey={cellBGImgKey ?? ""}
      onPress={(cell) => {
        console.log(cell);
      }}
    />
  );
}

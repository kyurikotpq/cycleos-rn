import dayjs from "dayjs";
import InteractiveHeatmap from "./InteractiveHeatmap";
import { useEffect, useState } from "react";
import { Text } from "react-native";

type HeatmapCell = {
  date: string | null; // Null for padding cells
  text: string | null;
  opacityValue?: number; // Optional value for the heatmap intensity
  borderColor?: string;
};

type Label = {
  label: string;
  rowIndex: number;
};

type HeatmapData = {
  weeks: HeatmapCell[][];
  labels: Label[];
  dayLabels: string[];
};

interface YearHeatMapProps {
  year: number;
}

export default function YearHeatMap({ year }: YearHeatMapProps) {
  const dayLabels = ["SUN", "", "", "WED", "", "", "SAT"];
  const [days, setDays] = useState<HeatmapCell[]>([]);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [monthLabels, setMonthLabels] = useState<string[]>([]);

  const calculateHeatmapData = () => {
    const firstDayOfYear = dayjs(`${year}-01-01`);
    const lastDayOfYear = dayjs(`${year + 1}-01-01`);
    const offset = firstDayOfYear.day();
    setOffsetX(offset); // Offset for the first row

    let all_days: HeatmapCell[] = [];
    let all_month_labels: string[] = [];
    let currentDate = firstDayOfYear;
    let previousMonth = -1;
    let numDays = 0;

    while (currentDate.isBefore(lastDayOfYear, "day")) {
      // @TODO: Add data coloring, currently it's random
      // There should be a better separation between the days and the data coloring
      all_days.push({
        date: currentDate.format("YYYY-MM-DD"),
        text: currentDate.format("D") == "1" ? currentDate.format("D") : null,
        opacityValue: Math.random(),
      });

      // Check if the current week starts and end in the same month
      // (Our week starts on Sunday)
      if (currentDate.day() == 0 || numDays == 0) {
        const month = currentDate.month();
        const endOfWeek = currentDate.endOf("week");

        if (month != endOfWeek.month() || currentDate.date() == 1)
          all_month_labels.push(endOfWeek.format("MMM"));
        else
          all_month_labels.push("");
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
      data={days}
      numColumns={7}
      numRows={Math.ceil(days.length / 7)}
      yLabels={monthLabels}
      xLabels={dayLabels}
      offsetX={offsetX}
      onPress={(cell) => {
        console.log(cell);
      }}
    />
  );
}

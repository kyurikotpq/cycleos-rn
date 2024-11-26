import dayjs from "dayjs";
import InteractiveHeatmap from "./InteractiveHeatmap";
import { useEffect, useState } from "react";
import { Text } from "react-native";

type HeatmapCell = {
  date: string | null; // Null for padding cells
  value?: number; // Optional value for the heatmap intensity
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
    setOffsetX(firstDayOfYear.day()); // Offset for the first row

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
        value: Math.random() * 100,
      });

      // Check if the current day is the start of a new month
      if ((numDays + firstDayOfYear.day()) % 7 === 0) {
        const month = currentDate.month();

        if (month !== previousMonth) {
          all_month_labels.push(dayjs(currentDate).format("MMM"));
          previousMonth = month;
        } else {
          all_month_labels.push("");
        }
      }

      currentDate = currentDate.add(1, "day");
      numDays++;
    }

    console.log(monthLabels);
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
    />
  );
}

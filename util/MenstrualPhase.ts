import { CreateCycleDayProps } from "@/db/controllers/cycle_days";
import { Dayjs } from "dayjs";

// Function to calculate the cycle phases
// @TODO: Does this account for start/end of daylight savings?
const calculateCyclePhases = (
  startDayjs: Dayjs, // format YYYY-MM-DD
  endDayjs: Dayjs,
  cycleLength: number,
  periodLength: number
): Record<string, string> => {
  const phases: Record<string, string> = {};

  // Menstrual phase
  for (let i = 0; i < periodLength; i++) {
    const date = startDayjs.add(i, "day").format("YYYY-MM-DD");
    phases[date] = "menstrual";
  }

  // Luteal phase (last 14 days)
  for (let i = 0; i < 14; i++) {
    const date = endDayjs.subtract(i, "day").format("YYYY-MM-DD");
    phases[date] = "luteal";
  }

  // Ovulatory phase (5 days in the middle of the cycle)
  for (let i = 0; i < 5; i++) {
    const date = endDayjs.subtract(14 + i, "day").format("YYYY-MM-DD");
    phases[date] = "ovulatory";
  }

  // Follicular phase (from the end of menstruation to the start of ovulation)
  const follicular_end_day = cycleLength - 14 - 5; // 14 days luteal phase, ovulation is 5 days
  for (let i = periodLength; i < follicular_end_day; i++) {
    const date = startDayjs.add(i, "day").format("YYYY-MM-DD");
    phases[date] = "follicular";
  }

  return phases;
};

// Convert into { id: string, phase: string }[]
const formatIntoCycleDays = (
  datesAndPhases: Record<string, string>,
  cycleId: number,
  zoneOffset: number
) => {
  const dates = Object.keys(datesAndPhases);
  const finalCycleDays: CreateCycleDayProps[] = [];

  for (let i = 0; i < dates.length; i++) {
    const cycleDay: CreateCycleDayProps = {
      id: dates[i],
      phase: datesAndPhases[dates[i]],
      cycleId,
      zoneOffset,
    };

    finalCycleDays.push(cycleDay);
  }

  return finalCycleDays;
};

export const getCycleDaysFromDates = (
  startDayjs: Dayjs,
  endDayjs: Dayjs,
  cycleLength: number,
  periodLength: number,
  cycleId: number,
  zoneOffset: number
) => {
  return formatIntoCycleDays(
    calculateCyclePhases(startDayjs, endDayjs, cycleLength, periodLength),
    cycleId,
    zoneOffset
  );
};
import dayjs from "dayjs";

// Function to calculate the cycle phases
export const calculateCyclePhases = (
  cycle_start_date: string, // format YYYY-MM-DD
  cycle_length: number,
  menstrual_length: number
): Record<string, string> => {
  const phases: Record<string, string> = {};

  // Starting point: cycle start date
  const startDate = dayjs(cycle_start_date);

  // Determine the end of the cycle
  const cycle_end_date = startDate.add(cycle_length - 1, "day");

  // Menstrual phase
  for (let i = 0; i < menstrual_length; i++) {
    const date = startDate.add(i, "day").format("YYYY-MM-DD");
    if (phases[date] != undefined) {
      console.error("CONFLICT: menstrual", phases[date], date);
    }
    phases[date] = "menstrual";
  }

  // Ovulatory phase (5 days in the middle of the cycle)
  const ovulation_start_day = cycle_length - 14 - 5; // 14 days luteal phase, ovulation is 5 days
  for (let i = 0; i < 5; i++) {
    const date = startDate
      .add(ovulation_start_day + i, "day")
      .format("YYYY-MM-DD");
    if (phases[date] != undefined) {
      console.error("CONFLICT: ovulatory", phases[date], date);
    }
    phases[date] = "ovulatory";
  }

  // Luteal phase (last 14 days)
  for (let i = 0; i < 14; i++) {
    const date = cycle_end_date.subtract(i, "day").format("YYYY-MM-DD");
    if (phases[date] != undefined) {
      console.error("CONFLICT: luteal", phases[date], date);
    }
    phases[date] = "luteal";
  }

  // Follicular phase (from the end of menstruation to the start of ovulation)
  const follicular_end_day = ovulation_start_day;
  for (let i = menstrual_length; i < follicular_end_day; i++) {
    const date = startDate.add(i, "day").format("YYYY-MM-DD");
    if (phases[date] != undefined) {
        console.error("CONFLICT: follicular", phases[date],  date)
    }
    phases[date] = "follicular";
  }

  return phases;
};

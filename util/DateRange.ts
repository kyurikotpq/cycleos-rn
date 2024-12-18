import { NUM_MS_PER_DAY } from "@/constants/Time";
import {
  CalendarActiveDateRange,
  fromDateId,
  toDateId,
} from "@marceloterreiro/flash-calendar";

// Utility function to calculate date difference in days
const dateDiffInDays = (date1: Date, date2: Date): number =>
  Math.ceil((date1.getTime() - date2.getTime()) / NUM_MS_PER_DAY);

// Helper function to create a new range spanning `num` days
const createNewRange = (
  date: Date,
  numDays: number
): CalendarActiveDateRange => {
  const startId = toDateId(date);
  const endId = toDateId(new Date(date.getTime() + numDays * NUM_MS_PER_DAY));
  return { startId, endId };
};

const mergeOverlappingRanges = (
  ranges: CalendarActiveDateRange[]
): CalendarActiveDateRange[] => {
  if (ranges.length === 0) return [];

  // Sort ranges by startId, and if equal, by endId
  ranges.sort((a, b) => {
    const startDiff =
      fromDateId(a.startId).getTime() - fromDateId(b.startId).getTime();

    return startDiff !== 0
      ? startDiff
      : fromDateId(b.endId).getTime() - fromDateId(a.endId).getTime();
  });

  const mergedRanges: CalendarActiveDateRange[] = [];
  let currentRange = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const nextRange = ranges[i];
    const currentEnd = fromDateId(currentRange.endId);
    const nextStart = fromDateId(nextRange.startId);

    // Check if ranges overlap or are adjacent
    console.log(currentEnd.getTime(), nextStart.getTime());
    if (nextStart.getTime() <= currentEnd.getTime()) {
      // Merge ranges by extending the current range's end
      currentRange.endId = toDateId(
        new Date(
          Math.max(currentEnd.getTime(), fromDateId(nextRange.endId).getTime())
        )
      );
    } else {
      // Push the current range and move to the next one
      mergedRanges.push(currentRange);
      currentRange = nextRange;
    }
  }

  // Add the last range
  mergedRanges.push(currentRange);

  return mergedRanges;
};

// Function to check and update ranges
export const handleDateSelection = (
  selectedDate: string,
  currentRanges: CalendarActiveDateRange[],
  numDays: number = 4
): CalendarActiveDateRange[] => {
  const selectedDateObj = fromDateId(selectedDate);

  let isDateHandled = false;
  const updatedRanges: CalendarActiveDateRange[] = currentRanges.flatMap(
    (range) => {
      const rangeStart = fromDateId(range.startId);
      const rangeEnd = fromDateId(range.endId);

      if (selectedDateObj >= rangeStart && selectedDateObj <= rangeEnd) {
        // Scenario 4: Selected date is within an existing range
        if (toDateId(selectedDateObj) === range.startId) {
          // Remove selected date from the start of the range
          isDateHandled = true;
          if (toDateId(rangeStart) === toDateId(rangeEnd)) {
            // If the range is a single day, remove it entirely
            return [];
          }

          return [
            {
              startId: toDateId(
                new Date(rangeStart.getTime() + NUM_MS_PER_DAY)
              ),
              endId: range.endId,
            },
          ];
        }

        if (toDateId(selectedDateObj) === range.endId) {
          // Remove selected date from the end of the range
          isDateHandled = true;
          if (toDateId(rangeStart) === toDateId(rangeEnd)) {
            // If the range is a single day, remove it entirely
            return [];
          }
          return [
            {
              startId: range.startId,
              endId: toDateId(new Date(rangeEnd.getTime() - NUM_MS_PER_DAY)),
            },
          ];
        }

        // The selected date is inside the range but not at the boundaries; do nothing
        isDateHandled = true;
        return [range];
      }

      // Return the original range if no changes are made
      return [range];
    }
  );

  if (!isDateHandled) {
    // Check for Scenario 3: Immediately before or after a range
    const expandedRanges = updatedRanges.map((range) => {
      const rangeStart = fromDateId(range.startId);
      const rangeEnd = fromDateId(range.endId);

      if (
        dateDiffInDays(selectedDateObj, rangeStart) === -1 ||
        dateDiffInDays(selectedDateObj, rangeEnd) === 1
      ) {
        isDateHandled = true;
        if (dateDiffInDays(selectedDateObj, rangeStart) === -1) {
          return { startId: selectedDate, endId: range.endId };
        } else {
          return { startId: range.startId, endId: selectedDate };
        }
      }

      return range;
    });

    if (!isDateHandled) {
      // Scenario 2: Close to an existing range
      const isCloseToRange = currentRanges.some((range) => {
        const rangeStart = fromDateId(range.startId);
        const rangeEnd = fromDateId(range.endId);

        return (
          dateDiffInDays(selectedDateObj, rangeStart) >= -7 &&
          dateDiffInDays(selectedDateObj, rangeEnd) <= 7
        );
      });

      if (isCloseToRange) {
        updatedRanges.push({ startId: selectedDate, endId: selectedDate });
      } else {
        // Scenario 1: Completely isolated - create a new range
        updatedRanges.push(createNewRange(selectedDateObj, numDays));
      }
    } else {
      return expandedRanges;
    }
  }

  return mergeOverlappingRanges(updatedRanges);
};

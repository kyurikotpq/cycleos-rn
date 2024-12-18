import { avg, eq, or, and, gte, gt, lte, lt, desc, sql } from "drizzle-orm";
import {
  CalendarActiveDateRange,
  fromDateId,
} from "@marceloterreiro/flash-calendar";
import { db } from "../client";
import { upsertCycleDays, updateCycleDaysByCycleId } from "./cycle_days";
import { Cycle, cycle } from "../schema";
import dayjs from "dayjs";
import { getCycleDaysFromDates } from "@/util/MenstrualPhase";
import { NUM_MS_PER_DAY } from "@/constants/Time";

interface CreateCycleProps {
  startDate: number;
  startZoneOffset: number;
  endDate: number;
  endZoneOffset: number;
  periodLength?: number;
  cycleLength?: number;
}

export const insertCycle = async ({
  startDate,
  startZoneOffset,
  endDate,
  endZoneOffset,
  periodLength,
  cycleLength,
}: CreateCycleProps) =>
  await db
    .insert(cycle)
    .values({
      startDate,
      startZoneOffset,
      endDate,
      endZoneOffset,
      periodLength,
      cycleLength,
    })
    .returning({ insertedId: cycle.id });

// Get all cycles in descending order of startDate
export const fetchCycles = async () =>
  await db.select().from(cycle).orderBy(desc(cycle.startDate));

// Get the average period and cycle length of the past 3 periods
export const getAverageCycleAndPeriodLength = async () =>
  await db
    .select({
      avgPeriodLength: avg(cycle.periodLength),
      avgCycleLength: avg(cycle.cycleLength),
    })
    .from(cycle)
    .orderBy(desc(cycle.startDate))
    .limit(3);

// Get the date ranges of all periods
// (To mark the calendar in AddCycleScreen)
// @TODO restrict to the past 12 months?
export const getAllPeriodsDateRanges = async () =>
  await db
    .select({
      id: cycle.id,
      startDate: cycle.startDate,
      periodLength: cycle.periodLength,
    })
    .from(cycle);

// Controller Actions
const checkForOverlappingCycles = async (
  newStartDate: number,
  newPeriodLength: number
) => {
  const newEndDate = newStartDate + (newPeriodLength - 1) * NUM_MS_PER_DAY;

  // Get existing cycles whose period overlaps or comes
  // consecutively before/after the specified period
  return await db
    .select({
      id: cycle.id,
    })
    .from(cycle)
    .where(
      or(
        // Overlap condition
        and(
          lte(cycle.startDate, newEndDate),
          gte(
            sql`${cycle.startDate} + (${cycle.periodLength} - 1) * ${NUM_MS_PER_DAY}`,
            newStartDate
          )
        ),
        // Consecutive conditions
        eq(cycle.startDate, newEndDate),
        eq(
          sql`${cycle.startDate} + (${cycle.periodLength} - 1) * ${NUM_MS_PER_DAY}`,
          newStartDate
        )
      )
    );
};

const getNextCycle = async (currStartDate: number): Promise<Cycle[]> =>
  await db
    .select()
    .from(cycle)
    .where(gt(cycle.startDate, currStartDate))
    .orderBy(cycle.startDate)
    .limit(1);

const getPrevCycle = async (currStartDate: number): Promise<Cycle[]> =>
  await db
    .select()
    .from(cycle)
    .where(lt(cycle.startDate, currStartDate))
    .orderBy(desc(cycle.startDate))
    .limit(1);

export const createCycle = async (
  dateRange: CalendarActiveDateRange,
  cycleLength: number
) => {
  if (dateRange && dateRange.startId && dateRange.endId) {
    const zoneOffset = -1 * fromDateId(dateRange.startId).getTimezoneOffset();

    const startDayjs = dayjs(dateRange.startId);
    const startDayjsUnix = startDayjs.valueOf();
    const endDayjs = dayjs(dateRange.endId); // for MENSTRUATION
    const periodLength = endDayjs.diff(startDayjs, "day") + 1;

    // Delete existing cycles to prevent duplication
    const existingCycle = await checkForOverlappingCycles(startDayjsUnix, periodLength);
    if (existingCycle.length > 0) {
      await Promise.all(existingCycle.map((c) => deleteCycle(c.id)));
    }

    const cycleDetails = {
      startDate: startDayjsUnix,
      startZoneOffset: zoneOffset,
      endZoneOffset: zoneOffset,
      periodLength,
      cycleLength,
      endDate: startDayjs.add(cycleLength, "day").valueOf(), // Initialize endDate
    };

    // Check if the next cycle exists
    const nextCycle: Cycle[] = await getNextCycle(startDayjsUnix);

    // If yes, use that as the current cycle's endDate
    if (nextCycle && nextCycle.length == 1 && nextCycle[0].startDate) {
      const thisCycleLength = Math.round(
        (nextCycle[0].startDate - startDayjsUnix) / NUM_MS_PER_DAY
      );
      cycleDetails.cycleLength = thisCycleLength;
      cycleDetails.endDate = nextCycle[0].startDate - NUM_MS_PER_DAY;
    }

    // Update previous cycle's end dates where relevant
    const prevCycle: Cycle[] = await getPrevCycle(startDayjsUnix);
    if (prevCycle.length > 0 && prevCycle[0].startDate) {
      const prevCycleDetails = {
        cycleLength: Math.round(
          (startDayjsUnix - prevCycle[0].startDate) / NUM_MS_PER_DAY
        ),
        endDate: startDayjs.subtract(1, "day").valueOf(),
      };

      await updateCycle(prevCycle[0].id, prevCycleDetails);

      const prevCycleDays = getCycleDaysFromDates(
        dayjs(prevCycle[0].startDate),
        dayjs(prevCycleDetails.endDate),
        prevCycleDetails.cycleLength,
        prevCycle[0].periodLength ?? 0,
        prevCycle[0].id,
        zoneOffset
      );

      await upsertCycleDays(prevCycleDays);
    }

    // Insert cycle - @TODO: Do I need a transaction here?
    const insertedCycle = await insertCycle(cycleDetails);

    // Insert all the days into cycle_days
    const cycleEndDayjs = dayjs(cycleDetails.endDate);
    const cycleDays = getCycleDaysFromDates(
      startDayjs,
      cycleEndDayjs,
      cycleDetails.cycleLength,
      periodLength,
      insertedCycle[0].insertedId,
      zoneOffset
    );

    return upsertCycleDays(cycleDays);
  }
};

export const updateCycle = async (cycleId: number, cycleDetails: any) =>
  await db.update(cycle).set(cycleDetails).where(eq(cycle.id, cycleId));

export const deleteCycle = async (cycleId: number, setNullPhase?: boolean) =>
  await db.transaction(async (tx) => {
    if (setNullPhase) {
      // Set the cycleId and phase to null for all cycle days
      await updateCycleDaysByCycleId(cycleId, { cycleId: null, phase: null });
    }

    // Delete the cycle
    await db.delete(cycle).where(eq(cycle.id, cycleId));
  });

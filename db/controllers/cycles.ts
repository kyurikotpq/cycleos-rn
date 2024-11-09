import { eq, gt, lt, desc } from "drizzle-orm";
import { CalendarActiveDateRange, fromDateId } from "@marceloterreiro/flash-calendar";
import { db } from "../client";
import { upsertCycleDays } from "./cycle_days";
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

export const fetchCycles = async () =>
  await db.select().from(cycle).orderBy(desc(cycle.startDate));

export const getMostRecentCycle = async () =>
  await db
    .select({ id: cycle.id })
    .from(cycle)
    .orderBy(desc(cycle.startDate))
    .limit(1);

// Controller Actions
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
    const zoneOffset = fromDateId(dateRange.startId).getTimezoneOffset();

    const startDayjs = dayjs(dateRange.startId);
    const startDayjsUnix = startDayjs.valueOf();
    const endDayjs = dayjs(dateRange.endId); // for MENSTRUATION
    const periodLength = endDayjs.diff(startDayjs, "day") + 1;

    const cycleDetails = {
      startDate: startDayjsUnix,
      startZoneOffset: zoneOffset,
      endZoneOffset: zoneOffset,
      periodLength,
      cycleLength: 0,
      endDate: 0, // Initialize endDate
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
    } else {
      cycleDetails.endDate = startDayjs.add(cycleLength, "day").valueOf();
      cycleDetails.cycleLength = cycleLength;
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

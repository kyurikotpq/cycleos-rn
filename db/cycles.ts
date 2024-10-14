import DateUtil from "@/constants/Date";
import { eq, gt, lt, desc } from "drizzle-orm";
import { CalendarActiveDateRange } from "@marceloterreiro/flash-calendar";
import { db } from "./client";
import { insertCycleDays } from "./cycle_days";
import { Cycle, cycle } from "./schema";

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
  cycleLength?: number
) => {
  if (dateRange && dateRange.startId && dateRange.endId) {
    const zoneOffset = DateUtil.getTimezoneOffset(new Date());
    const startDate = DateUtil.parseISODate(dateRange.startId);

    const periodDays = DateUtil.getRange(dateRange.startId, dateRange.endId);

    const cycleDetails = {
      startDate: startDate.getTime(),
      startZoneOffset: zoneOffset,
      endZoneOffset: zoneOffset,
      periodLength: periodDays.length,
      cycleLength: 0,
      endDate: 0, // Initialize endDate
    };

    if (cycleLength) {
      (cycleDetails.endDate = DateUtil.add(
        startDate,
        "d",
        parseInt(`${cycleLength}`)
      ).getTime()), // Predicted end date
        (cycleDetails.cycleLength = parseInt(`${cycleLength}`));
    } else {
      // Check if the next cycle exists
      const nextCycle: Cycle[] = await getNextCycle(startDate.getTime());

      // If yes, use that as the current cycle's endDate
      if (nextCycle && nextCycle.length == 1 && nextCycle[0].startDate) {
        cycleDetails.cycleLength = Math.round(
          (nextCycle[0].startDate - startDate.getTime()) / 86400000
        );
        cycleDetails.endDate = nextCycle[0].startDate;
      }
    }

    // Update previous cycle's end dates where relevant
    const prevCycle = await getPrevCycle(startDate.getTime());
    if (prevCycle && prevCycle.length == 1 && prevCycle[0].startDate) {
      const prevCycleDetails = {
        cycleLength: Math.round(
          (startDate.getTime() - prevCycle[0].startDate) / 86400000
        ),
        endDate: startDate.getTime(),
      };

      updateCycle(prevCycle[0].id, prevCycleDetails);
    }

    const addCycleResult = await insertCycle(cycleDetails);

    // Insert the menstrual days into cycle_days
    const cycleDays = periodDays.map((dateId) => ({
      cycleId: addCycleResult[0].insertedId,
      dateId,
      zoneOffset,
      phase: "menstrual",
    }));

    return insertCycleDays(cycleDays);
  }
};

export const updateCycle = async (cycleId: number, cycleDetails: any) =>
  await db.update(cycle).set(cycleDetails).where(eq(cycle.id, cycleId));

const numMsPerHour = 60 * 60 * 1000;
const numMsPerDay = 24 * numMsPerHour;
const numMsPerWeek = 7 * numMsPerDay;
const numMsPerMonth = 30 * numMsPerDay;

/**
 * Get number of milliseconds for the specified
 * type and amount of 'type'
 * @param {string} type
 * @param {number} amount
 * @returns {number}
 */
const getMs = (type: string, amount: number): number => {
  let numMs = 0;
  switch (type) {
    case "h":
      numMs = amount * numMsPerHour;
      break;
    case "d":
      numMs = amount * numMsPerDay;
      break;
    case "w":
      numMs = amount * numMsPerWeek;
      break;
    case "m":
      numMs = amount * numMsPerMonth;
      break;
  }
  return numMs;
};

/**
 * Add "amount" of hours/days/months to the
 * supplied date
 *
 * @param {Date | string} date
 * @param {string} type
 * @param {number} amount
 * @returns {Date}
 */
const add = (date: Date | string, type: string, amount: number): Date => {
  let newDate = new Date();

  if (typeof date === "string") date = new Date(date);

  let numMsToAdd = getMs(type, amount);
  return new Date(newDate.setTime(date.getTime() + numMsToAdd));
};

/**
 * Minus/Sub "amount" of hours/days/months to the
 * supplied date
 *
 * @param {Date | string} date
 * @param {string} type
 * @param {number} amount
 * @returns {Date}
 */
const sub = (date: Date | string, type: string, amount: number): Date => {
  let newDate = new Date();

  if (typeof date === "string") date = new Date(date);

  let numMsToSub = getMs(type, amount);
  return new Date(newDate.setTime(date.getTime() - numMsToSub));
};

const getDuration = (start: Date | string, end: Date | string): number => {
  if (typeof start === "string") start = new Date(start);
  if (typeof end === "string") end = new Date(end);

  const durationMs = end.getTime() - start.getTime();
  return durationMs / numMsPerDay;
};

const getTimezoneOffset = (date: Date | string): number => {
  if (typeof date === "string") date = new Date(date);
  return date.getTimezoneOffset() / 60;
};

const getRange = (start: Date | string, end: Date | string): string[] => {
  if (typeof start === "string") start = new Date(start);
  if (typeof end === "string") end = new Date(end);

  let range: string[] = [];
  let current = new Date(start);

  while (current <= end) {
    range.push(new Date(current).toLocaleDateString("en-CA"));
    current = add(current, "d", 1);
  }

  return range;
};

const DateUtil = { getMs, add, sub, getDuration, getTimezoneOffset, getRange };

export default DateUtil;

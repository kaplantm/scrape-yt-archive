import { chunk } from "./array-utils";
import { getRange } from "./num-utils";

// source: https://stackoverflow.com/a/6313008
export const secondsToHHMMSS = (totalSeconds: number) => {
  const sec_num = totalSeconds;
  let hours: number | string = Math.floor(sec_num / 3600);
  let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
  let seconds: number | string = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
};

// export const easyEpochDate = (year: number, month = 1, day = 1) =>
//   new Date(
//     `${year}-${month.toString().padStart(2, "0")}-${day
//       .toString()
//       .padStart(2, "0")}T00:00:00`
//   ).getTime();

export const easyEpochDate = (year: number, month = 1, day = 1) =>
  new Date(Date.UTC(year, month, day, 0, 0, 0)).getTime();

export const msToDays = (ms: bigint) =>
  ms ? parseFloat(ms / (1000n * 60n * 60n * 24n)) : 0;

export const monthNames = new Array(12).fill(0).map((_, i) => {
  return new Date(`${i + 1}/1/2005`).toLocaleDateString(undefined, {
    month: "long",
  });
});

export const daysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export const getWeekDays = (format = "long") => {
  const baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(undefined, { weekday: format }));
    baseDate.setDate(baseDate.getDate() + 1);
  }
  return weekDays;
};

export const weekDays = getWeekDays();

export const getCalendarArray = (month: number, year: number): number[] => {
  const startDayOfWeek = new Date(`${month}/1/${year}`).getDay();
  const lastDayOfMonth = daysInMonth(month, year);
  return [...new Array(startDayOfWeek), ...getRange(1, lastDayOfMonth + 1)];
};

export const addDays = (date: string, days = 1) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const dateFromEpoch = (epoch: bigint) =>
  new Date(parseInt(epoch as unknown as string));

export const localeDateStringOptions = {
  numeric: {
    weekday: undefined,
    year: "numeric" as const,
    month: "numeric" as const,
    day: "numeric" as const,
  },
  shortMonthYYYY: {
    weekday: undefined,
    year: "numeric" as const,
    month: "short" as const,
    day: undefined,
  },
  YYYY: {
    weekday: undefined,
    year: "numeric" as const,
    month: undefined,
    day: undefined,
  },
};

export const dateFormatters = {
  numeric: (date: Date) =>
    date.toLocaleDateString(undefined, localeDateStringOptions.numeric),
  shortMonthYYYY: (date: Date) =>
    date.toLocaleDateString(undefined, localeDateStringOptions.shortMonthYYYY),
  YYYY: (date: Date) =>
    date.toLocaleDateString(undefined, localeDateStringOptions.YYYY),
};

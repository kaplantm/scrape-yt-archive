import { getRange } from "./num-utils";
import { daysInMonth } from "./time-utils";

// export const years = getRange(2005, new Date().getFullYear());
export const years = getRange(2005, 2011);
export const getDays = (month: number, year: number) => getRange(1, daysInMonth(month, year));

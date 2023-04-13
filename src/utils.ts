import { erasArray } from "./constants";
import { Era, eraName } from "./types";
import fs from "fs";
import path from "path";

export const removeUrlTimestampPrefix = (timestamp: string, url: string) =>
  url.replace(`/web/${timestamp}/`, "");

export const isInEra = (era: Era, timestamp: number) => {
  return timestamp >= era.start && timestamp <= era.end;
};

export const findEraForTimestamp = (timestamp: number) =>
  erasArray.find((era) => isInEra(era, timestamp));

export const getWaybackUrl = (timestamp: string) =>
  `https://web.archive.org/web/${timestamp}/https://www.youtube.com/`;

// https://traveling-coderman.net/code/synchronous-promise-loop/
export async function allSynchronously<T>(
  resolvables: (() => Promise<T> | T)[]
): Promise<T[]> {
  const results = [];
  for (const resolvable of resolvables) {
    results.push(await resolvable());
  }
  return results;
}

// wayback timestamp: 20111006185455 (oct 6 2011 @ 18:54:55)
// ISO string: 2011-10-06T18:54:55
export const getISOStringFromWaybackTimestamp = (ts: string) => {
  return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}T${ts.slice(
    8,
    10
  )}:${ts.slice(10, 12)}:${ts.slice(12, 14)}+00:00`;
};

export const sleep = (ms = 3000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const safeTrim = (str: string | undefined) => (str || "").trim();
export const safeSplit = (str: string | undefined, splitter: string) =>
  (str || "").split(splitter);
export const getVideoId = (str: string | undefined) => {
  try {
    return str?.split("v=")[1]?.split("&")[0] || "";
  } catch (e) {
    return "";
  }
};

export const getKeyFromTimeStamp = (timestamp: string) =>
  timestamp.substring(0, timestamp.length - 4);
export const getEraBoundFromTimeStamp = (timestamp: string) =>
  parseInt(getKeyFromTimeStamp(timestamp));

// https://stackoverflow.com/a/9640417
export const convertDurationToSeconds = (duration: string): number => {
  const p = duration.split(":");
  let s = 0;
  let m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop() || "0", 10);
    m *= 60;
  }

  return s;
};

export const readFile = (file: string) =>
  fs.readFileSync(path.resolve(__dirname, file), {
    encoding: "utf8",
    flag: "r",
  });

export const targetLimit = parseInt(process.env.LIMIT || "0");
export const mockTargets = process.env.MOCK === "true";
export const onlyFeature = process.env.FEATURE as eraName;

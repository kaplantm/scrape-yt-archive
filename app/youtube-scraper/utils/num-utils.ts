export const getRange = (startAt = 0, endAt: number) => {
  const size = endAt - startAt;
  return Array.from(new Array(size), (x, i) => i + startAt);
};

export const roundToNearest = (x: number, roundTo = 0.5) => Math.round(x / roundTo) * roundTo;

export const commas = (number: number | bigint) => number.toLocaleString(undefined);

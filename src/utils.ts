import { eras } from "./constants";
import { Era } from "./types";

export const isInEra = (era: Era, timestamp: number) => {
  return timestamp >= era.start && timestamp <= era.end;
};

export const findEraForTimestamp = (timestamp: number) =>
  eras.find((era) => isInEra(era, timestamp));

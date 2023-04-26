import { CountResult } from "types/generic-db-types";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  videoJoinVideoScraperInstance,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";
import prisma from "prisma/app-client";

export const authorRawQueries = {
  uniqueVideoAuthorsInTimePeriod: async (start: number, end: number): Promise<CountResult> =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT authorId) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${videoJoinVideoScraperInstance} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
};

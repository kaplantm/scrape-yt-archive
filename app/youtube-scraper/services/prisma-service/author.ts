import { Prisma } from "@prisma/client";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  videoJoinVideoScraperInstance,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";

export const authorRawQueries = {
  uniqueVideoAuthorsInTimePeriod: (start: number, end: number) =>
    Prisma.sql`SELECT COUNT(DISTINCT authorId) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${videoJoinVideoScraperInstance} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
};

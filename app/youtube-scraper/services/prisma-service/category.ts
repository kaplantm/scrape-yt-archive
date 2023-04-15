import { Prisma } from "@prisma/client";
import prisma from "prisma/app-client";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  categoryToVideoScrapeInstanceJoinVideoScrapeInstance,
  videoJoinVideoScraperInstance,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";

export const getCategoriesByFrequency = async (sort: "desc" | "asc" = "desc", where?: Prisma.CategoryWhereInput) =>
  (await prisma.category.findMany({
    include: {
      _count: {
        select: { VideoScrapeInstance: true },
      },
    },
    orderBy: { VideoScrapeInstance: { _count: sort } },
    take: 5,
    where,
  })) || null;

export const categoryRawQueries = {
  uniqueTagsTimePeriod: (start: number, end: number) =>
    Prisma.sql`SELECT COUNT(DISTINCT authorId) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${videoJoinVideoScraperInstance} ${categoryToVideoScrapeInstanceJoinVideoScrapeInstance} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
};

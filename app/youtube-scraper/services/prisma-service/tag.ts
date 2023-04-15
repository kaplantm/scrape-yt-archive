import prisma from "prisma/app-client";
import { Prisma } from "@prisma/client";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  tagToVideoScrapeInstanceJoinVideoScrapeInstance,
  videoJoinVideoScraperInstance,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";

export const getTagsByFrequency = async (sort: "desc" | "asc" = "desc", where?: Prisma.TagWhereInput) =>
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

export const tagRawQueries = {
  uniqueTagsTimePeriod: (start: number, end: number) =>
    Prisma.sql`SELECT COUNT(DISTINCT authorId) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${videoJoinVideoScraperInstance} ${tagToVideoScrapeInstanceJoinVideoScrapeInstance} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
};
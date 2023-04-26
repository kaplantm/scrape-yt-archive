import { Prisma } from "@prisma/client";

// TODO: now remove all these?
export const getWhereEpochDateWithin = (start: number, end: number) =>
  Prisma.sql`WHERE epochDate>=${start} AND epochDate<=${end}`;
export const fromVideoScrapeInstance = Prisma.sql`FROM VideoScrapeInstance`;
export const videoScrapeInstanceJoinFeatureDate = Prisma.sql`INNER JOIN FeatureDate ON FeatureDate.id=VideoScrapeInstance.featureDateId`;
export const videoJoinVideoScraperInstance = Prisma.sql`INNER JOIN Video ON VideoScrapeInstance.videoId=Video.id`;
export const tagToVideoScrapeInstanceJoinVideoScrapeInstance = Prisma.sql`INNER JOIN _TagToVideoScrapeInstance ON _TagToVideoScrapeInstance.B = VideoScrapeInstance.id `;
export const categoryToVideoScrapeInstanceJoinVideoScrapeInstance = Prisma.sql`INNER JOIN _CategoryToVideoScrapeInstance ON _CategoryToVideoScrapeInstance.B = VideoScrapeInstance.id `;

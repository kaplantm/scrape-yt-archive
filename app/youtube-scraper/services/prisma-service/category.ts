import { Prisma } from "@prisma/client";
import prisma from "prisma/app-client";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  categoryToVideoScrapeInstanceJoinVideoScrapeInstance,
  videoJoinVideoScraperInstance,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";
import { CountResult } from "types/generic-db-types";

const getMostPopularCategories = (start: number, end: number): Promise<CountResult> =>
  prisma.$queryRaw`
SELECT c.id,
       c.name,
       COUNT(DISTINCT(vsi.videoId)) AS COUNT
FROM VideoScrapeInstance vsi
JOIN _CategoryToVideoScrapeInstance vsit ON vsit.B = vsi.id
JOIN FeatureDate fd ON vsi.featureDateId = fd.id
JOIN Category c ON c.id = vsit.A
WHERE c.name != "" AND fd.epochDate >= ${start} AND fd.epochDate <= ${end}
GROUP BY c.id
ORDER BY COUNT(DISTINCT(vsi.videoId)) DESC
LIMIT 5
`;

const getLeastPopularCategories = (start: number, end: number): Promise<CountResult> =>
  prisma.$queryRaw`
SELECT c.id,
       c.name,
       COUNT(DISTINCT(vsi.videoId)) AS COUNT
FROM VideoScrapeInstance vsi
JOIN _CategoryToVideoScrapeInstance vsit ON vsit.B = vsi.id
JOIN FeatureDate fd ON vsi.featureDateId = fd.id
JOIN Category c ON c.id = vsit.A
WHERE c.name != "" AND fd.epochDate >= ${start} AND fd.epochDate <= ${end}
GROUP BY c.id
ORDER BY COUNT(DISTINCT(vsi.videoId)) ASC
LIMIT 5
`;

export const categoryRawQueries = {
  uniqueTagsTimePeriod: async (start: number, end: number): Promise<CountResult> =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT authorId) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${videoJoinVideoScraperInstance} ${categoryToVideoScrapeInstanceJoinVideoScrapeInstance} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
  mostFeaturedCategories: async (start: number, end: number) => getMostPopularCategories(start, end),
  leastFeaturedCategories: async (start: number, end: number) => getLeastPopularCategories(start, end),
};
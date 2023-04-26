import prisma from "prisma/app-client";
import { getWhereEpochDateWithin } from "./utils/raw-queries";
import { CountResult } from "types/generic-db-types";

const getMostPopularTags = async (start: number, end: number): Promise<CountResult> =>
  prisma.$queryRaw`
SELECT t.id,
       t.name,
       COUNT(DISTINCT(vsi.videoId)) AS COUNT
FROM VideoScrapeInstance vsi
JOIN _TagToVideoScrapeInstance vsit ON vsit.B = vsi.id
JOIN FeatureDate fd ON vsi.featureDateId = fd.id
JOIN Tag t ON t.id = vsit.A
WHERE t.name != "" AND fd.epochDate >= ${start} AND fd.epochDate <= ${end}
GROUP BY t.id
ORDER BY COUNT(DISTINCT(vsi.videoId)) DESC
LIMIT 5`;

const getLeastPopularTags = async (start: number, end: number): Promise<CountResult> =>
  prisma.$queryRaw`
SELECT t.id,
       t.name,
       COUNT(DISTINCT(vsi.videoId)) AS COUNT
FROM VideoScrapeInstance vsi
JOIN _TagToVideoScrapeInstance vsit ON vsit.B = vsi.id
JOIN FeatureDate fd ON vsi.featureDateId = fd.id
JOIN Tag t ON t.id = vsit.A
WHERE t.name != "" AND fd.epochDate >= ${start} AND fd.epochDate <= ${end}
GROUP BY t.id
ORDER BY COUNT(DISTINCT(vsi.videoId)) ASC
LIMIT 5`;

export const tagRawQueries = {
  uniqueTagsTimePeriod: async (start: number, end: number): Promise<CountResult> =>
    prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT _TagToVideoScrapeInstance.A) as count 
      FROM 
        VideoScrapeInstance 
        INNER JOIN FeatureDate ON FeatureDate.id = VideoScrapeInstance.featureDateId 
        INNER JOIN Video ON VideoScrapeInstance.videoId = Video.id 
        INNER JOIN _TagToVideoScrapeInstance ON _TagToVideoScrapeInstance.B = VideoScrapeInstance.id
      ${getWhereEpochDateWithin(start, end)}
      `,
  mostFeaturedTags: async (start: number, end: number) => getMostPopularTags(start, end),
  leastFeaturedTags: async (start: number, end: number) => getLeastPopularTags(start, end),
};

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
  mostFeaturedAuthor: async (start: number, end: number): Promise<CountResult> =>
    prisma.$queryRaw`
    SELECT 
    User.id,
    ChannelName.name,
    COUNT(DISTINCT(Video.id)) as count
    FROM 
      VideoScrapeInstance
      INNER JOIN FeatureDate on FeatureDate.id = VideoScrapeInstance.featureDateId
      INNER JOIN Video ON Video.id = VideoScrapeInstance.videoId
      INNER JOIN User ON User.id = Video.authorId 
      INNER JOIN _ChannelNameToUser ON _ChannelNameToUser.B = User.id
      INNER JOIN ChannelName ON ChannelName.id = _ChannelNameToUser.A
    ${getWhereEpochDateWithin(start, end)}
    GROUP BY 
      User.id, ChannelName.name
    ORDER BY 
      COUNT(DISTINCT(Video.id)) DESC
    LIMIT 5`,
};

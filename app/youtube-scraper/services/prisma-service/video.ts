import { VideoDataRaw } from "services/types";
import { Prisma, User } from "@prisma/client";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";
import prisma from "prisma/app-client";
import { CountResult } from "types/generic-db-types";

export const getVideoWhereUniqueInput = (
  youtubeVideoId: string
): Prisma.VideoWhereUniqueInput => ({
  youtubeVideoId,
});

export const getVideoCreateInput = <T>(
  videoRaw: VideoDataRaw,
  author: T & Pick<User, "id">
): Prisma.VideoCreateInput => ({
  youtubeVideoId: videoRaw.videoId,
  uploadDate: videoRaw.uploadDate,
  Author: { connect: { id: author.id } },
  Links: {
    connectOrCreate: [
      {
        where: { url: videoRaw.videoLink },
        create: { url: videoRaw.videoLink },
      },
    ],
  },
});

export const videoRawQueries = {
  uniqueVideoIdsInTimePeriod: async (
    start: number,
    end: number
  ): Promise<CountResult> =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT videoId) as count FROM VideoScrapeInstance INNER JOIN FeatureDate ON FeatureDate.id=VideoScrapeInstance.featureDateId ${getWhereEpochDateWithin(
      start,
      end
    )}`,
  videoIdWithMostFeatureDays: async (
    start: number,
    end: number
  ): Promise<{ count: number; id: number }[]> =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT SUBSTRING(waybackTimestamp, 1, 8)) as count, videoId as id FROM VideoScrapeInstance 
  INNER JOIN FeatureDate ON FeatureDate.id=VideoScrapeInstance.featureDateId 
  ${getWhereEpochDateWithin(start, end)}
  GROUP BY videoId ORDER BY count desc LIMIT 1`,
};

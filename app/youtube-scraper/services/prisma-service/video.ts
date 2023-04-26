import { VideoDataRaw } from "services/types";
import { Prisma, User } from "@prisma/client";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";
import prisma from "prisma/app-client";
import { CountResult } from "types/generic-db-types";

export const getVideoWhereUniqueInput = (youtubeVideoId: string): Prisma.VideoWhereUniqueInput => ({
  youtubeVideoId,
});

export const getVideoCreateInput = (videoRaw: VideoDataRaw, author: T & Pick<User, "id">): Prisma.VideoCreateInput => ({
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
  uniqueVideoIdsInTimePeriod: async (start: number, end: number): Promise<CountResult> =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT videoId) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
};

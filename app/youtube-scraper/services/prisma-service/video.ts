import { VideoDataRaw } from "services/types";
import { Prisma, User } from "@prisma/client";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";

export const getVideoWhereUniqueInput = <T>(
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
  uniqueVideoIdsInTimePeriod: (start: number, end: number) =>
    Prisma.sql`SELECT COUNT(DISTINCT videoId) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
};
import { VideoDataRaw } from "services/types";
import { getVideoCreateInput, getVideoWhereUniqueInput } from "./video";
import { getFeatureDateCreateInput, getFeatureDateWhereUniqueInput } from "./feature-date";
import { Prisma, PrismaClient, User, VideoScrapeInstance } from "@prisma/client";
import prisma from "prisma/app-client";
import { getChannelNameCreateInput, getChannelNameWhereUniqueInput } from "./channel-name";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  videoJoinVideoScraperInstance,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";
import { msToDays } from "utils/time-utils";
import { roundToNearest } from "utils/num-utils";

export const getVideoScrapeWhereInput = (
  videoId: number,
  waybackTimestamp: number
): Prisma.VideoScrapeInstanceWhereUniqueInput => ({
  videoId_waybackTimestamp: {
    videoId,
    waybackTimestamp,
  },
});

export const getVideoScrapeCreateInput = (
  videoRaw: VideoDataRaw,
  author: User
): Prisma.VideoScrapeInstanceCreateInput => ({
  title: videoRaw.title,
  description: videoRaw.description,
  duration: videoRaw.duration,
  age: videoRaw.age,
  comments: videoRaw.comments,
  views: videoRaw.views,
  ratings: videoRaw.numRatings,
  stars: videoRaw.stars,
  featureType: videoRaw.featureType,
  waybackTimestamp: parseInt(videoRaw.timestampFeatured),
  Video: {
    connectOrCreate: {
      create: getVideoCreateInput(videoRaw, author),
      where: getVideoWhereUniqueInput(videoRaw.videoId),
    },
  },
  DisplayName: {
    connectOrCreate: {
      create: getChannelNameCreateInput(videoRaw.author),
      where: getChannelNameWhereUniqueInput(videoRaw.author),
    },
  },
  FeatureDate: {
    connectOrCreate: {
      create: getFeatureDateCreateInput(videoRaw.dateFeaturedEpoch),
      where: getFeatureDateWhereUniqueInput(videoRaw.dateFeaturedEpoch),
    },
  },
  Link: {
    connectOrCreate: {
      where: { url: videoRaw.videoLink },
      create: { url: videoRaw.videoLink },
    },
  },
  Categories: {
    connectOrCreate: videoRaw.categories.map((category: string) => ({
      where: { name: category },
      create: { name: category },
    })),
  },
  Tags: {
    connectOrCreate: videoRaw.tags.map((tag: string) => ({
      where: { name: tag.toLowerCase() },
      create: { name: tag.toLowerCase() },
    })),
  },
});

export const getFirstVideoScrapeInstance = async (
  prisma: PrismaClient,
  key: keyof VideoScrapeInstance = "views",
  sort = "desc",
  where?: Prisma.VideoScrapeInstanceWhereInput
) =>
  (await prisma.videoScrapeInstance.findFirst({
    orderBy: { [key]: sort },
    include: {
      Video: {
        include: {
          Links: true,
          // TODO: now include just 1?
          VideoScrapeInstances: true,
          Author: {
            include: { DisplayName: true, Links: true, Username: true },
          },
        },
      },
      DisplayName: true,
      FeatureDate: true,
      Selector: { include: { DisplayName: true, Links: true, Username: true } },
    },
    where: { [key]: { not: null }, ...where },
  })) || null;

export const getMostAndLeastScrapeInstance = async ({
  prisma,
  key,
  options: { most, least, sentiment },
  where,
}: {
  prisma: PrismaClient;
  key: keyof VideoScrapeInstance;
  options: {
    most: string;
    least: string;
    sentiment?: "postive" | "negative" | "neutral";
  };
  where?: Prisma.VideoScrapeInstanceWhereInput;
}) => {
  const mostVideoScrapeInstance = await getFirstVideoScrapeInstance(prisma, key, "desc", where);
  const leastVideoScrapeInstance = await getFirstVideoScrapeInstance(prisma, key, "asc", where);
  return {
    most: {
      videoScrapeInstance: mostVideoScrapeInstance,
      value: mostVideoScrapeInstance ? mostVideoScrapeInstance[key] : null,
      label: most,
      sentiment: sentiment || "positive",
    },
    least: {
      videoScrapeInstance: leastVideoScrapeInstance,
      value: leastVideoScrapeInstance ? leastVideoScrapeInstance[key] : null,
      label: least,
      sentiment: sentiment || "negative",
    },
  };
};

export const videoScrapeInstanceRawQueries = {
  uniqueWaybackTimestamps: async (start: number, end: number) =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT waybackTimestamp) as count ${fromVideoScrapeInstance} ${videoScrapeInstanceJoinFeatureDate} ${getWhereEpochDateWithin(
      start,
      end
    )}`,
  uniqueVideosAsFeatured: async (start: number, end: number) =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT Video.id) as count ${fromVideoScrapeInstance} ${videoJoinVideoScraperInstance} ${videoScrapeInstanceJoinFeatureDate} ${getWhereEpochDateWithin(
      start,
      end
    )} AND featureType = "featured"`,
  uniqueVideosAsSpotlight: async (start: number, end: number) =>
    prisma.$queryRaw`SELECT COUNT(DISTINCT Video.id) as count ${fromVideoScrapeInstance} ${videoJoinVideoScraperInstance} ${videoScrapeInstanceJoinFeatureDate} ${getWhereEpochDateWithin(
      start,
      end
    )} AND featureType = "spotlight"`,
  longestTimeFeatured: async (start: number, end: number) =>
    prisma.$queryRaw`
                SELECT DISTINCT vsi.*,
                                earliestFeature,
                                latestFeature,
                                (earliestFeature-latestFeature) AS timeDiff,
                                FeatureDate.epochDate as epochDate
                FROM VideoScrapeInstance AS vsi
                JOIN FeatureDate
                JOIN
                  (SELECT vsiInner.videoId,
                          fdInner.epochDate AS earliestFeature
                  FROM VideoScrapeInstance AS vsiInner
                  JOIN FeatureDate AS fdInner ON fdInner.id = vsiInner.featureDateId
                  GROUP BY vsiInner.videoId,
                            fdInner.epochDate
                  ORDER BY earliestFeature DESC
                  LIMIT 1) AS early
                JOIN
                  (SELECT vsiInner.videoId,
                          fdInner.epochDate AS latestFeature
                  FROM VideoScrapeInstance AS vsiInner
                  JOIN FeatureDate AS fdInner ON fdInner.id = vsiInner.featureDateId
                  GROUP BY vsiInner.videoId,
                            fdInner.epochDate
                  ORDER BY latestFeature ASC
                  LIMIT 1) AS late
                ${getWhereEpochDateWithin(start, end)}
                ORDER BY timeDiff DESC`,
};

export const getLongestTimeFeatured = async (start: number, end: number) => {
  const data = (await videoScrapeInstanceRawQueries.longestTimeFeatured(start, end)) as VideoScrapeInstance & {
    timeDiff: number;
  };

  return {
    most: {
      videoScrapeInstance: data,
      value: data.timeDiff ? roundToNearest(msToDays(data.timeDiff)) : 0,
      label: "Longest Time Featued",
      sentiment: "positive",
    },
  };
};

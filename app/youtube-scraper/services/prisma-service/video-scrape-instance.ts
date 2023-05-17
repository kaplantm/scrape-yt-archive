import { VideoDataRaw } from "services/types";
import {
  getVideoCreateInput,
  getVideoWhereUniqueInput,
  videoRawQueries,
} from "./video";
import {
  getFeatureDateCreateInput,
  getFeatureDateWhereUniqueInput,
} from "./feature-date";
import {
  Prisma,
  PrismaClient,
  User,
  VideoScrapeInstance,
} from "@prisma/client";
import prisma from "prisma/app-client";
import {
  getChannelNameCreateInput,
  getChannelNameWhereUniqueInput,
} from "./channel-name";
import {
  fromVideoScrapeInstance,
  getWhereEpochDateWithin,
  videoJoinVideoScraperInstance,
  videoScrapeInstanceJoinFeatureDate,
} from "./utils/raw-queries";
import { dateFormatters, dateFromEpoch, msToDays } from "utils/time-utils";
import { roundToNearest } from "utils/num-utils";
import { pluralize } from "utils/string-utils";

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
  author: User,
  selector?: User
): Prisma.VideoScrapeInstanceCreateInput => {
  const selectorData = selector
    ? {
        Selector: {
          connect: { id: selector?.id },
        },
      }
    : {};
  return {
    title: videoRaw.title,
    description: videoRaw.description,
    duration: videoRaw.duration,
    age: videoRaw.age,
    comments: videoRaw.comments,
    views: videoRaw.views,
    ratings: videoRaw.numRatings,
    stars: videoRaw.stars,
    featureType: videoRaw.featureType,
    featureLabel: videoRaw.featureLabel,
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
    ...selectorData,
  };
};

export const getFirstVideoScrapeInstance = async (
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
    where: { [key]: { not: undefined }, ...where },
  })) || null;

export const getMostAndLeastScrapeInstance = async ({
  key,
  options: { most, least, sentiment, transformValue },
  where,
}: {
  key: keyof VideoScrapeInstance;
  options: {
    most: string;
    least: string;
    sentiment?: "postive" | "negative" | "neutral";
    transformValue?: (val: any) => string;
  };
  where?: Prisma.VideoScrapeInstanceWhereInput;
}) => {
  const mostVideoScrapeInstance = await getFirstVideoScrapeInstance(
    key,
    "desc",
    where
  );
  const leastVideoScrapeInstance = await getFirstVideoScrapeInstance(
    key,
    "asc",
    where
  );
  const defaultTransformer = (val: any) => `${val} ${key}`;
  const transformer = transformValue || defaultTransformer;
  return {
    most: {
      videoScrapeInstance: mostVideoScrapeInstance,
      value: mostVideoScrapeInstance
        ? transformer(mostVideoScrapeInstance[key])
        : null,
      label: most,
      sentiment: sentiment || "positive",
    },
    least: {
      videoScrapeInstance: leastVideoScrapeInstance,
      value: leastVideoScrapeInstance
        ? transformer(leastVideoScrapeInstance[key])
        : null,
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
  longestTimeFeatured: async (
    start: number,
    end: number
  ): Promise<
    { videoId: number; earliestFeature: bigint; latestFeature: bigint }[]
  > =>
    prisma.$queryRaw`
    SELECT DISTINCT vsi.videoId,
                earliestFeature,
                latestFeature,
                (earliestFeature-latestFeature) AS diff 
FROM VideoScrapeInstance AS vsi
JOIN
  (SELECT vsiInner.videoId,
          fdInner.epochDate AS earliestFeature
   FROM VideoScrapeInstance AS vsiInner
   JOIN FeatureDate AS fdInner ON fdInner.id = vsiInner.featureDateId
   GROUP BY vsiInner.videoId,
            fdInner.epochDate
   ORDER BY earliestFeature DESC) AS early ON early.videoId = vsi.VideoId
JOIN
  (SELECT vsiInner.videoId,
          fdInner.epochDate AS latestFeature
   FROM VideoScrapeInstance AS vsiInner
   JOIN FeatureDate AS fdInner ON fdInner.id = vsiInner.featureDateId
   WHERE fdInner.epochDate>=${start} AND fdInner.epochDate<=${end}
   GROUP BY vsiInner.videoId,
            fdInner.epochDate
   ORDER BY latestFeature ASC) AS late ON late.videoId = vsi.VideoId
   ORDER BY diff DESC
   LIMIT 1`,
};

export const getLongestTimeFeatured = async (start: number, end: number) => {
  console.log("getLongestTimeFeatured");
  const instance = (
    await videoScrapeInstanceRawQueries.longestTimeFeatured(start, end)
  )[0];

  console.log("*****instance", {
    instance: instance,
    start,
    end,
  });

  if (!instance?.videoId) {
    return {};
  }

  console.log("asdfjkashdfjkashdfjkahsdjkfashjk");
  console.log(instance);
  const firstFeatureDate = dateFormatters.numeric(
    dateFromEpoch(instance.latestFeature) // TODO: these are reversed in the SQL query
  );
  const lastFeatureDate = dateFormatters.numeric(
    dateFromEpoch(instance.earliestFeature)
  );
  return {
    most: {
      videoScrapeInstance: await getFirstVideoScrapeInstance("videoId", "asc", {
        videoId: instance.videoId,
      }),
      value: [
        `First Feature: ${firstFeatureDate}`,
        `Latest Feature: ${lastFeatureDate}`,
      ],
      label: "Longest Feature Range",
      sentiment: "positive",
    },
  };
};

export const getMostFeatured = async (
  start: number,
  end: number,
  where: Prisma.VideoScrapeInstanceWhereInput
) => {
  const video = (
    await videoRawQueries.videoIdWithMostFeatureDays(start, end)
  )[0];

  console.log("**** getLongestTimeFeatured 1", start, end);
  console.log({ video });
  if (!video?.id) {
    return {};
  }

  const videoScrapeInstance = await getFirstVideoScrapeInstance(
    "featureDateId",
    "desc",
    { videoId: video.id, ...where }
  );
  console.log("**** getLongestTimeFeatured 2");
  console.log({ video });
  console.log({ videoScrapeInstance });

  return {
    most: {
      videoScrapeInstance,
      value: `Featured ${video.count} ${pluralize("Day", video.count)}`,
      label: "Most Often Featured",
      sentiment: "positive",
    },
  };
};

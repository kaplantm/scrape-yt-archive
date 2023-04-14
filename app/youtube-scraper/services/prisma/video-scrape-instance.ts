import { VideoDataRaw } from "@/services/types";
import {
  Prisma,
  PrismaClient,
  Video,
  VideoScrapeInstance,
} from "@prisma/client";

export const getVideoScrapeInstanceUpsertArgs = (
  videoRaw: VideoDataRaw,
  video: Video
): Prisma.VideoScrapeInstanceUpsertArgs => {
  const selectorData = videoRaw.selectedBy
    ? {
        Selector: {
          connectOrCreate: {
            where: {
              username: videoRaw.selectedBy,
            },
            create: {
              username: videoRaw.selectedBy,
              link: {
                connectOrCreate: {
                  where: { url: videoRaw.selectedByLink },
                  create: { url: videoRaw.selectedByLink },
                },
              },
            },
          },
        },
      }
    : {};
  const upsertData: Prisma.VideoScrapeInstanceUpsertArgs["create"] = {
    FeatureDate: {
      connectOrCreate: {
        create: {
          epoch_date: videoRaw.dateFeaturedEpoch,
        },
        where: { epoch_date: videoRaw.dateFeaturedEpoch },
      },
    },
    Video: { connect: { id: video.id } },
    age: videoRaw.age,
    feature_type: videoRaw.featureType,
    comments: videoRaw.comments,
    ratings: videoRaw.numRatings,
    stars: videoRaw.stars,
    views: videoRaw.views,
    wayback_timestamp: parseInt(videoRaw.timestampFeatured),
    ...selectorData,
  };
  return {
    where: {
      videoId_wayback_timestamp: {
        videoId: video.id,
        wayback_timestamp: parseInt(videoRaw.timestampFeatured),
      },
    },
    create: upsertData,
    update: upsertData,
  };
};

export const getFirstVideoScrapeInstance = async (
  client: PrismaClient,
  key: keyof VideoScrapeInstance = "views",
  sort = "desc"
) =>
  (await client.videoScrapeInstance.findFirst({
    orderBy: { [key]: sort },
    include: { Video: true, FeatureDate: true, Selector: true },
    where: { [key]: { not: null } },
  })) || null;

import { VideoDataRaw } from "@/services/types";
import { Prisma, Video } from "@prisma/client";

export const getVideoUpsertArgs = (
  videoRaw: VideoDataRaw
): Prisma.VideoUpsertArgs => {
  const upsertData: Prisma.VideoUpsertArgs["create"] = {
    title: videoRaw.title,
    description: videoRaw.description,
    videoUrlId: videoRaw.videoId,
    uploadDate: videoRaw.uploadDate,
    duration: videoRaw.duration,
    Author: {
      connectOrCreate: {
        where: {
          username: videoRaw.author,
        },
        create: {
          username: videoRaw.author,
          link: {
            connectOrCreate: {
              where: { url: videoRaw.authorLink },
              create: { url: videoRaw.authorLink },
            },
          },
          display_name: {
            connectOrCreate: {
              where: { name: videoRaw.author },
              create: { name: videoRaw.author },
            },
          },
        },
      },
    },
    FeatureDate: {
      connectOrCreate: {
        where: {
          epoch_date: videoRaw.dateFeaturedEpoch,
        },
        create: {
          epoch_date: videoRaw.dateFeaturedEpoch,
          wayback_timestamp: parseInt(videoRaw.timestampFeatured),
        },
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
  };
  return {
    where: { videoUrlId: videoRaw.videoId },
    create: upsertData,
    update: upsertData,
  };
};

export const getFeatureInstanceUpsertArgs = (
  videoRaw: VideoDataRaw,
  video: Video
): Prisma.FeatureInstanceUpsertArgs => {
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
  const upsertData: Prisma.FeatureInstanceUpsertArgs["create"] = {
    FeatureDate: { connect: { id: video.featureDateId } },
    Video: { connect: { id: video.id } },
    age: videoRaw.age,
    feature_type: videoRaw.featureType,
    comments: videoRaw.comments,
    ratings: videoRaw.numRatings,
    stars: videoRaw.stars,
    views: videoRaw.views,
    ...selectorData,
  };
  return {
    where: {
      videoId_featureDateId: {
        videoId: video.id,
        featureDateId: video.featureDateId,
      },
    },
    create: upsertData,
    update: upsertData,
  };
};

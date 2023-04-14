import { VideoDataRaw } from "@/services/types";
import { Prisma } from "@prisma/client";

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

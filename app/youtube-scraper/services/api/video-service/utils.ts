import { VideoDataRaw } from "@/services/types";
import { getConnectOrCreate, getConnectOrCreateMany } from "@/services/utils";
import { Prisma } from "@prisma/client";

export const getVideoCreateArgs = (
  videoRaw: VideoDataRaw
): Prisma.VideoCreateArgs => ({
  data: {
    title: videoRaw.title,
    description: videoRaw.description,
    videoUrlId: videoRaw.videoId,
    uploadDate: videoRaw.uploadDate,
    age: videoRaw.age,
    comments: videoRaw.comments,
    ratings: videoRaw.numRatings,
    stars: videoRaw.stars,
    views: videoRaw.views,
    selector: getConnectOrCreate({
      username: videoRaw.selectedBy,
      link: videoRaw.selectedByLink,
    }),
    author: getConnectOrCreate({
      username: videoRaw.author,
      link: videoRaw.authorLink,
    }),
    tags: getConnectOrCreateMany(
      videoRaw.tags.map((tag: string) => ({ name: tag }))
    ),
    categories: getConnectOrCreateMany(
      videoRaw.categories.map((category: string) => ({ name: category }))
    ),
  },
  include: {
    author: true,
    selector: true,
    tags: true,
    categories: true,
  },
});

import { ApiResponse, VideoDataRaw } from "services/types";
import { Video, VideoScrapeInstance } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  getChannelNameCreateInput,
  getChannelNameWhereUniqueInput,
} from "services/prisma-service/channel-name";
import {
  getUserCreateInput,
  getUserWhereUniqueInput,
} from "services/prisma-service/user";
import {
  getVideoScrapeCreateInput,
  getVideoScrapeWhereInput,
} from "services/prisma-service/video-scrape-instance";
import {
  getVideoCreateInput,
  getVideoWhereUniqueInput,
} from "services/prisma-service/video";

const prismaClient = new PrismaClient();

// https://traveling-coderman.net/code/synchronous-promise-loop/
export async function allSynchronously<T>(
  resolvables: (() => Promise<T>)[]
): Promise<T[]> {
  const results = [];
  for (const resolvable of resolvables) {
    results.push(await resolvable());
  }
  return results;
}

// TODO: now better batch updates
export const upsertVideoScrapInstance = async (
  videosRaw: VideoDataRaw[]
): Promise<ApiResponse<VideoScrapeInstance[]>> => {
  console.log(
    `****** here createVideos ${
      videosRaw?.length ? videosRaw[0].timestampFeatured : "no featured videos?"
    } count: ${videosRaw.length}`
  );
  try {
    const data = (
      await allSynchronously(
        videosRaw.map((videoRaw) => async () => {
          const channelNameData = await prismaClient.channelName.upsert({
            create: getChannelNameCreateInput(videoRaw.author),
            update: getChannelNameCreateInput(videoRaw.author),
            where: getChannelNameWhereUniqueInput(videoRaw.author),
          });
          const authorData = await prismaClient.user.upsert({
            create: getUserCreateInput(videoRaw),
            update: getUserCreateInput(videoRaw),
            where: getUserWhereUniqueInput(channelNameData.id),
          });

          const videoData = await prismaClient.video.upsert({
            create: getVideoCreateInput(videoRaw, authorData),
            update: getVideoCreateInput(videoRaw, authorData),
            where: getVideoWhereUniqueInput(videoRaw.videoId),
          });

          const videoScrapeInstanceData =
            await prismaClient.videoScrapeInstance.upsert({
              create: getVideoScrapeCreateInput(videoRaw, authorData),
              update: getVideoScrapeCreateInput(videoRaw, authorData),
              where: getVideoScrapeWhereInput(
                videoData.id,
                parseInt(videoRaw.timestampFeatured)
              ),
            });

          return videoScrapeInstanceData;
        })
      )
    ).map((result) => result);

    return { status: 200, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e)
    return { status: 500, data: { error: `Server Error ${e?.message}` } };
  }
};

export const getVideo = async (
  args: Prisma.VideoFindFirstOrThrowArgs
): Promise<ApiResponse<Video>> => {
  try {
    const data = await prismaClient.video.findFirstOrThrow(args);
    return { status: 200, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { status: 500, data: { error: `Server Error ${e?.message}` } };
  }
};

export const getVideos = async (
  args: Prisma.VideoFindManyArgs
): Promise<ApiResponse<Video[]>> => {
  try {
    const data = await prismaClient.video.findMany(args);
    return { status: 200, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { status: 500, data: { error: `Server Error ${e?.message}` } };
  }
};

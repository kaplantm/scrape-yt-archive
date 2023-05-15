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
import { NextApiRequest } from "next";

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

export const getVideoScrapeInstances = async (
  query: NextApiRequest["query"]
): Promise<ApiResponse<VideoScrapeInstance[]>> => {
  try {
    const whereTimestamp = query.timestamp
      ? { waybackTimestamp: BigInt(query.timestamp as string) }
      : undefined;
    const instances = await prismaClient.videoScrapeInstance.findMany({
      where: whereTimestamp,
    });
    return { status: 200, data: instances || [] };
  } catch (e: any) {
    return { status: 500, data: { error: `Server Error ${e?.message}` } };
  }
};

// TODO: now better batch updates
export const upsertVideoScrapInstance = async (
  videosRaw: VideoDataRaw[]
): Promise<ApiResponse<VideoScrapeInstance[]>> => {
  try {
    const data = (
      await allSynchronously(
        videosRaw.map((videoRaw) => async () => {
          // Author
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

          // Selector
          let selectorData = undefined;
          if (videoRaw.selectedBy && videoRaw.selectedByLink) {
            const selectorChannelNameData =
              await prismaClient.channelName.upsert({
                create: getChannelNameCreateInput(videoRaw.selectedBy),
                update: getChannelNameCreateInput(videoRaw.selectedBy),
                where: getChannelNameWhereUniqueInput(videoRaw.selectedBy),
              });
            selectorData = await prismaClient.user.upsert({
              create: getUserCreateInput({
                author: videoRaw.selectedBy,
                authorLink: videoRaw.selectedByLink,
              }),
              update: getUserCreateInput({
                author: videoRaw.selectedBy,
                authorLink: videoRaw.selectedByLink,
              }),
              where: getUserWhereUniqueInput(selectorChannelNameData.id),
            });
          }
          
          const videoData = await prismaClient.video.upsert({
            create: getVideoCreateInput(videoRaw, authorData),
            update: getVideoCreateInput(videoRaw, authorData),
            where: getVideoWhereUniqueInput(videoRaw.videoId),
          });

          console.log({
            by: videoRaw.selectedBy,
            link: videoRaw.selectedByLink,
          });
          const videoScrapeInstanceData =
            await prismaClient.videoScrapeInstance.upsert({
              create: getVideoScrapeCreateInput(
                videoRaw,
                authorData,
                selectorData
              ),
              update: getVideoScrapeCreateInput(
                videoRaw,
                authorData,
                selectorData
              ),
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
    console.log(e);
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

import { ApiResponse, VideoDataRaw } from "@/services/types";
import { Video } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import { getVideoCreateArgs } from "./utils";

const prismaClient = new PrismaClient();

export const createVideo = async (
  videoRaw: VideoDataRaw
): Promise<ApiResponse<Video>> => {
  try {
    const data = await prismaClient.video.create(getVideoCreateArgs(videoRaw));
    return { status: 200, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { status: 500, data: { error: `Server Error ${e?.message}` } };
  }
};

export const createVideos = async (
  videosRaw: VideoDataRaw[]
): Promise<ApiResponse<Prisma.BatchPayload>> => {
  try {
    const data = await prismaClient.video.createMany({
      data: videosRaw.map((videoRaw) => getVideoCreateArgs(videoRaw).data),
      skipDuplicates: true,
    });
    return { status: 200, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
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
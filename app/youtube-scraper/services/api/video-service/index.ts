import { ApiResponse, VideoDataRaw } from "@/services/types";
import { Video } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import { getVideoUpsertArgs } from "../../prisma/video";
import { getVideoScrapeInstanceUpsertArgs } from "../../prisma/video-scrape-instance";

const prismaClient = new PrismaClient();

// export const createVideo = async (
//   videoRaw: VideoDataRaw
// ): Promise<ApiResponse<Video>> => {
//   console.log("****** here createVideo");
//   try {
//     const data = await prismaClient.video.create(getVideoCreateArgs(videoRaw));
//     return { status: 200, data };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (e: any) {
//     console.log("******errror", e);
//     return { status: 500, data: { error: `Server Error ${e?.message}` } };
//   }
// };

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
export const createVideos = async (
  videosRaw: VideoDataRaw[]
): Promise<ApiResponse<Video[]>> => {
  console.log(
    `****** here createVideos ${
      videosRaw?.length ? videosRaw[0].timestampFeatured : "no featured videos?"
    } count: ${videosRaw.length}`
  );
  try {
    // const data = await prismaClient.video.createMany({
    //   data: videosRaw.map((videoRaw) => getVideoCreateArgs(videoRaw).data),
    //   skipDuplicates: true,
    // });
    const data = (
      await allSynchronously(
        videosRaw.map((videoRaw) => async () => {
          const video = await prismaClient.video.upsert(
            getVideoUpsertArgs(videoRaw)
          );

          await prismaClient.videoScrapeInstance.upsert(
            getVideoScrapeInstanceUpsertArgs(videoRaw, video)
          );
          return video;
        })
      )
    ).map((result) => result);

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

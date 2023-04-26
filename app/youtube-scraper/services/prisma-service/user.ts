import { VideoDataRaw } from "services/types";
import { Prisma } from "@prisma/client";
import prisma from "prisma/app-client";
import { getWhereEpochDateWithin } from "./utils/raw-queries";

export const getUserWhereUniqueInput = <T>(
  usernameId: number
): Prisma.UserWhereUniqueInput => ({
  usernameId,
});

export const getUserCreateInput = <T>(
  data: T & Pick<VideoDataRaw, "author" | "authorLink" | "author">
): Prisma.UserCreateInput => ({
  Username: {
    connect: { name: data.author },
  },
  Links: {
    connectOrCreate: {
      where: { url: data.authorLink },
      create: { url: data.authorLink },
    },
  },
  DisplayName: {
    connectOrCreate: {
      where: { name: data.author },
      create: { name: data.author },
    },
  },
});



const getMostFeaturedUser = (start: number, end: number): Promise<CountResult> =>
  prisma.$queryRaw`
SELECT 
User.id,
ChannelName.name,
COUNT(DISTINCT(Video.id))
FROM 
  VideoScrapeInstance
  JOIN FeatureDate fd ON VideoScrapeInstance.featureDateId = fd.id
  INNER JOIN Video ON Video.id = VideoScrapeInstance.videoId
  INNER JOIN User ON User.id = Video.authorId 
  INNER JOIN _ChannelNameToUser ON _ChannelNameToUser.B = User.id
  INNER JOIN ChannelName ON ChannelName.id = _ChannelNameToUser.A
  WHERE fd.epochDate >= ${start} AND fd.epochDate >= ${end}
GROUP BY 
  User.id, ChannelName.name
ORDER BY 
  COUNT(DISTINCT(Video.id)) DESC`;

export const tagRawQueries = {
  uniqueTagsTimePeriod: async (start: number, end: number): Promise<CountResult> =>
    prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT authorId) as count 
      FROM 
        VideoScrapeInstance 
        INNER JOIN FeatureDate ON FeatureDate.id = VideoScrapeInstance.featureDateId 
        INNER JOIN Video ON VideoScrapeInstance.videoId = Video.id 
        INNER JOIN _TagToVideoScrapeInstance ON _TagToVideoScrapeInstance.B = VideoScrapeInstance.id
      ${getWhereEpochDateWithin(start, end)}
      `,
  getMostFeaturedUser: async (start: number, end: number) => getMostFeaturedUser(start, end),
};
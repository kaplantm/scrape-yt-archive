import { VideoDataRaw } from "services/types";
import { Prisma } from "@prisma/client";

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

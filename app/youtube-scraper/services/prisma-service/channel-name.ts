import { Prisma } from "@prisma/client";

export const getChannelNameWhereUniqueInput = <T>(
  name: string
): Prisma.ChannelNameWhereUniqueInput => ({
  name,
});

export const getChannelNameCreateInput = <T>(
  name: string
): Prisma.ChannelNameCreateInput => ({
  name,
});

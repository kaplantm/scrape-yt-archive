import { Prisma } from "@prisma/client";

export const getFeatureDateWhereUniqueInput = <T>(
  epochDate: number
): Prisma.FeatureDateWhereUniqueInput => ({
  epochDate,
});

export const getFeatureDateCreateInput = <T>(
  epochDate: number
): Prisma.FeatureDateCreateInput => ({
  epochDate,
});

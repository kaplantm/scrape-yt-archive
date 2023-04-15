import {
  getMostAndLeastScrapeInstance,
  videoScrapeInstanceRawQueries,
} from "services/prisma-service/video-scrape-instance";
import prisma from "prisma/app-client";
import { GetStaticPropsContext } from "next";
import { getRange } from "utils/num-utils";
import { easyEpochDate } from "utils/time-utils";
import { batchRawSql } from "utils/prisma-utils";
import { authorRawQueries } from "services/prisma-service/author";
import { videoRawQueries } from "services/prisma-service/video";
import { tagRawQueries } from "services/prisma-service/tag";
import { categoryRawQueries } from "services/prisma-service/category";

type Count = Promise<{ count: number }[]>;
const getCounts = async (start: number, end: number) => {
  return batchRawSql({
    authorsCount: prisma.$queryRaw`${authorRawQueries.uniqueVideoAuthorsInTimePeriod(start, end)}` as Count,
    videosCount: prisma.$queryRaw`${videoRawQueries.uniqueVideoIdsInTimePeriod(start, end)}` as Count,
    numScrapes: prisma.$queryRaw`${videoScrapeInstanceRawQueries.uniqueWaybackTimestamps(start, end)}` as Count,
    numFeatured: prisma.$queryRaw`${videoScrapeInstanceRawQueries.uniqueVideosAsFeatured(start, end)}` as Count,
    numSpotlight: prisma.$queryRaw`${videoScrapeInstanceRawQueries.uniqueVideosAsSpotlight(start, end)}` as Count,
    tagsCount: prisma.$queryRaw`${tagRawQueries.uniqueTagsTimePeriod(start, end)}` as Count,
    categoriesCount: prisma.$queryRaw`${categoryRawQueries.uniqueTagsTimePeriod(start, end)}` as Count,
  });
};

type PageParams = { year: string };

export const generatePageStaticPaths = () => {
  const years = getRange(2005, new Date().getFullYear());
  return years.map((year) => ({ params: { year: year.toString() } }));
};

export const generatePageStaticProps = async ({ params }: GetStaticPropsContext) => {
  const year = parseInt((params as PageParams).year);
  const start = easyEpochDate(year);
  const end = easyEpochDate(year + 1);
  const whereFeatureDateInYear = { FeatureDate: { epochDate: { gte: start, lt: end } } };
  const whereForTagsAndCategories = { VideoScrapeInstance: { every: whereFeatureDateInYear } };
  const getMostLeast = async (params: Pick<Parameters<typeof getMostAndLeastScrapeInstance>[0], "key" | "options">) =>
    getMostAndLeastScrapeInstance({ prisma, where: whereFeatureDateInYear, ...params });

  return {
    highlightedFeaturedVideos: [
      await getMostLeast({ key: "views", options: { most: "Most Viewed", least: "Least Viewed" } }),
      await getMostLeast({ key: "ratings", options: { most: "Most Rating", least: "Fewest Ratings" } }),
      await getMostLeast({ key: "stars", options: { most: "Top Rated", least: "Lowest Rated" } }),
      await getMostLeast({ key: "comments", options: { most: "Most Comments", least: "Fewest Comments" } }),
      await getMostLeast({ key: "duration", options: { most: "Longest", least: "Shorted" } }),
    ],
    // TODO: now update frequency logic? use raw?
    // tags: {
    //   mostPopular: await getTagsByFrequency(prisma, "asc", whereForTagsAndCategories),
    //   leastPopular: await getTagsByFrequency(prisma, "desc", whereForTagsAndCategories),
    // },
    // categories: {
    //   mostPopular: await getCategoriesByFrequency(prisma, "asc", whereForTagsAndCategories),
    //   leastPopular: await getCategoriesByFrequency(prisma, "desc", whereForTagsAndCategories),
    // },
    counts: await getCounts(start, end),
  };
};

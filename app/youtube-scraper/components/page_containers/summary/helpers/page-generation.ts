import {
  getLongestTimeFeatured,
  getMostAndLeastScrapeInstance,
  videoScrapeInstanceRawQueries,
} from "services/prisma-service/video-scrape-instance";
import { GetStaticPropsContext } from "next";
import { easyEpochDate, secondsToHHMMSS } from "utils/time-utils";
import { batchRawSql } from "utils/prisma-utils";
import { authorRawQueries } from "services/prisma-service/author";
import { tagRawQueries } from "services/prisma-service/tag";
import { categoryRawQueries } from "services/prisma-service/category";
import { years } from "utils/path-utils";
import { commas } from "utils/num-utils";

type PageParams = { year: string };

export const generatePageStaticPaths = () =>
  years.map((year) => ({ params: { year: year.toString() } }));

export const generatePageStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const paramYear = parseInt((params as PageParams)?.year);
  const year = paramYear || 2005;
  const start = easyEpochDate(year);
  const end = easyEpochDate((paramYear || new Date().getFullYear()) + 1);
  const whereFeatureDateInYear = {
    FeatureDate: { epochDate: { gte: start, lt: end } },
  };
  const getMostLeast = async (
    params: Pick<
      Parameters<typeof getMostAndLeastScrapeInstance>[0],
      "key" | "options"
    >
  ) =>
    getMostAndLeastScrapeInstance({ where: whereFeatureDateInYear, ...params });

  console.log("***", { start, end });
  return {
    highlightedFeaturedVideos: [
      await getMostLeast({
        key: "views",
        options: {
          most: "Most Viewed",
          least: "Least Viewed",
          transformValue: (value) =>
            `${commas(value)} View${!value || value > 1 ? "s" : ""}`,
        },
      }),
      await getMostLeast({
        key: "ratings",
        options: {
          most: "Most Rated",
          least: "Fewest Ratings",
          transformValue: (value) =>
            `${value} Rating${!value || value > 1 ? "s" : ""}`,
        },
      }),
      await getMostLeast({
        key: "stars",
        options: {
          most: "Top Rated",
          least: "Lowest Rated",
          transformValue: (value) =>
            `${value} Star${!value || value > 1 ? "s" : ""}`,
        },
      }),
      await getMostLeast({
        key: "comments",
        options: {
          most: "Most Comments",
          least: "Fewest Comments",
          transformValue: (value) =>
            `${value} Commment${!value || value > 1 ? "s" : ""}`,
        },
      }),
      await getMostLeast({
        key: "duration",
        options: {
          most: "Longest",
          least: "Shortest",
          transformValue: (value) => secondsToHHMMSS(value),
        },
      }),
      await getLongestTimeFeatured(start, end),
    ],
    // Using raw queries for some logic not supported by prisma around count distinct
    mostLeastList: [
      {
        value: await tagRawQueries.mostFeaturedTags(start, end),
        label: "Top tags",
        sentiment: "positive",
      },
      // {
      //   value: await tagRawQueries.leastFeaturedTags(start, end),
      //   label: "Least popular tags",
      //   sentiment: "negative",
      // },
      {
        value: await categoryRawQueries.mostFeaturedCategories(start, end),
        label: "Top categories",
        sentiment: "positive",
      },
      // {
      //   value: await categoryRawQueries.leastFeaturedCategories(start, end),
      //   label: "Least popular categories",
      //   sentiment: "negative",
      // },
    ],
    counts: await batchRawSql({
      numFeatured: {
        label: "Featured Videos",
        value: (
          await videoScrapeInstanceRawQueries.uniqueVideosAsFeatured(start, end)
        )[0].count,
      },
      authorsCount: {
        label: "Featured Authors",
        value: (
          await authorRawQueries.uniqueVideoAuthorsInTimePeriod(start, end)
        )[0].count,
      },
      numSpotlight: {
        label: "Spotlight Videos",
        value: (
          await videoScrapeInstanceRawQueries.uniqueVideosAsSpotlight(
            start,
            end
          )
        )[0].count,
      },
      categoriesCount: {
        label: "Categories",
        value: (
          await categoryRawQueries.uniqueTagsTimePeriod(start, end)
        )[0].count,
      },
      tagsCount: {
        label: "Unique Tags",
        value: (await tagRawQueries.uniqueTagsTimePeriod(start, end))[0].count,
      },
      numScrapes: {
        label: "Page Snapshops",
        value: (
          await videoScrapeInstanceRawQueries.uniqueWaybackTimestamps(
            start,
            end
          )
        )[0].count,
      },
    }),
    mostFeaturedAuthors: await authorRawQueries.mostFeaturedAuthor(start, end),
  };
};

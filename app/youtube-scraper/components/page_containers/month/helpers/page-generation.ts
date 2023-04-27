import {
  getLongestTimeFeatured,
  getMostAndLeastScrapeInstance,
  getVideoScrapeInstances,
  videoScrapeInstanceRawQueries,
} from "services/prisma-service/video-scrape-instance";
import { GetStaticPropsContext } from "next";
import { addDays, easyEpochDate, getCalendarArray, monthNames, secondsToHHMMSS } from "utils/time-utils";
import { batchRawSql } from "utils/prisma-utils";
import { authorRawQueries } from "services/prisma-service/author";
import { tagRawQueries } from "services/prisma-service/tag";
import { categoryRawQueries } from "services/prisma-service/category";
import { years } from "utils/path-utils";
import { videoRawQueries } from "services/prisma-service/video";

type PageParams = { year: string; month: string };

// TODO: now check if scraping right now or off by 1
export const generatePageStaticPaths = () =>
  years
    .map((year) => monthNames.map((month, i) => ({ params: { year: year.toString(), month: i.toString() } })))
    .flat();

export const generatePageStaticProps = async ({ params }: GetStaticPropsContext) => {
  const year = parseInt((params as PageParams)?.year);
  const month = parseInt((params as PageParams)?.month);
  const calendarArray = getCalendarArray(month, year);

  // TODO: now DRY?
  const getDataForDay = async (day: number) => {
    const start = easyEpochDate(year, month, day);
    const nextDay = addDays(`${month}/${day}/${year}`);
    const end = easyEpochDate(nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate());

    console.log("><><><><", {
      day,
      start,
      end,
      nextDay,
      y: nextDay.getFullYear(),
      m: nextDay.getMonth(),
      d: nextDay.getDate(),
    });

    return {
      videos: await videoRawQueries.uniqueVideosInTimePeriod(start, end),
      // highlightedFeaturedVideos: [
      //   await getMostLeast({ key: "views", options: { most: "Most Viewed", least: "Least Viewed" } }),
      //   await getMostLeast({ key: "ratings", options: { most: "Most Rated", least: "Fewest Ratings" } }),
      //   await getMostLeast({ key: "stars", options: { most: "Top Rated", least: "Lowest Rated" } }),
      //   await getMostLeast({ key: "comments", options: { most: "Most Comments", least: "Fewest Comments" } }),
      //   await getMostLeast({
      //     key: "duration",
      //     options: { most: "Longest", least: "Shortest", transformValue: (value) => secondsToHHMMSS(value) },
      //   }),
      //   await getLongestTimeFeatured(start, end),
      // ],
      // // Using raw queries for some logic not supported by prisma around count distinct
      // mostLeastList: [
      //   {
      //     value: await tagRawQueries.mostFeaturedTags(start, end),
      //     label: "Top tags",
      //     sentiment: "positive",
      //   },
      //   // {
      //   //   value: await tagRawQueries.leastFeaturedTags(start, end),
      //   //   label: "Least popular tags",
      //   //   sentiment: "negative",
      //   // },
      //   {
      //     value: await categoryRawQueries.mostFeaturedCategories(start, end),
      //     label: "Top categories",
      //     sentiment: "positive",
      //   },
      //   // {
      //   //   value: await categoryRawQueries.leastFeaturedCategories(start, end),
      //   //   label: "Least popular categories",
      //   //   sentiment: "negative",
      //   // },
      // ],
      // counts: await batchRawSql({
      //   numFeatured: {
      //     label: "Featured Videos",
      //     value: (await videoScrapeInstanceRawQueries.uniqueVideosAsFeatured(start, end))[0].count,
      //   },
      //   authorsCount: {
      //     label: "Featured Authors",
      //     value: (await authorRawQueries.uniqueVideoAuthorsInTimePeriod(start, end))[0].count,
      //   },
      //   numSpotlight: {
      //     label: "Spotlight Videos",
      //     value: (await videoScrapeInstanceRawQueries.uniqueVideosAsSpotlight(start, end))[0].count,
      //   },
      //   categoriesCount: {
      //     label: "Categories",
      //     value: (await categoryRawQueries.uniqueTagsTimePeriod(start, end))[0].count,
      //   },
      //   tagsCount: { label: "Unique Tags", value: (await tagRawQueries.uniqueTagsTimePeriod(start, end))[0].count },
      //   numScrapes: {
      //     label: "Page Snapshops",
      //     value: (await videoScrapeInstanceRawQueries.uniqueWaybackTimestamps(start, end))[0].count,
      //   },
      // }),
      // mostFeaturedAuthors: await authorRawQueries.mostFeaturedAuthor(start, end),
    };
  };

  return {
    calendarArray: await Promise.all(calendarArray.map(async (day) => (day ? await getDataForDay(day) : null))),
  };
};

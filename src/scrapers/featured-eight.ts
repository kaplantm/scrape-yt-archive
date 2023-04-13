import { Cheerio, CheerioAPI, Element } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  safeSplit,
  safeTrim,
  removeUrlTimestampPrefix,
} from "../utils";

const getCurriedTextFromClassById =
  (featuredItem: Cheerio<Element>) => (query: string) =>
    safeTrim(featuredItem.find(query).text());

export const featuredEightScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const container = $('.homepage-content-block:contains("Featured Videos")');
  const featuredItems = container.find(".video-cell");

  console.log("*****", { featuredItems: featuredItems.length });
  const featuredVideos: FeaturedVideo[] = [];
  featuredItems.each((i, el) => {
    const featuredItem = $(el);
    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    const videoId = safeSplit(
      featuredItem.find(".video-long-title a").attr("id"),
      "video-long-title-"
    )[1];

    const getTextFromClass = getCurriedTextFromClassById(featuredItem);
    const views = getTextFromClass(".video-view-count");
    const authorLink = featuredItem.find(".video-username a").attr("href");
    console.log(featuredItem.find(".video-username a"));
    console.log("**** authorLink",  authorLink
    ? removeUrlTimestampPrefix(snapshot.timestamp, authorLink)
    : undefined,);
    const featuredVideo = {
      title: getTextFromClass(".video-long-title a"),
      duration: convertDurationToSeconds(getTextFromClass(".video-time")),
      description: getTextFromClass(".video-description"),
      tags: [],
      views: parseInt(views.replace(",", "")) || undefined,
      author: getTextFromClass(".video-username"),
      authorLink: authorLink
        ? removeUrlTimestampPrefix(snapshot.timestamp, authorLink)
        : undefined,
      videoId,
      uploadDate: undefined,
      comments: undefined,
      stars: undefined,
      numRatings: undefined,
      age: undefined,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories: [],
      selectedBy: undefined,
      selectedByLink: undefined,
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

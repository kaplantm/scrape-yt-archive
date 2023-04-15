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

const getFeaturedVideos = (
  items: Cheerio<Element>,
  $: CheerioAPI,
  snapshot: Snapshot,
  featureType = "featured"
) => {
  const isoDateFeatured = getISOStringFromWaybackTimestamp(snapshot.timestamp);
  const date = new Date(isoDateFeatured);
  const featuredVideos: FeaturedVideo[] = [];
  items.each((i, el) => {
    const featuredItem = $(el);

    const videoLink = removeUrlTimestampPrefix(
      snapshot.timestamp,
      featuredItem.find(".video-long-title a").attr("id")
    );
    const videoId = safeSplit(
      featuredItem.find(".video-long-title a").attr("id"),
      "video-long-title-"
    )[1];

    const getTextFromClass = getCurriedTextFromClassById(featuredItem);
    const views = getTextFromClass(".video-view-count");
    const authorLink = removeUrlTimestampPrefix(
      snapshot.timestamp,
      featuredItem.find(".video-username a").attr("href")
    );

    const stars = featuredItem.find(".ratingVS").attr("title");

    const featuredVideo = {
      title: getTextFromClass(".video-long-title a"),
      duration: convertDurationToSeconds(getTextFromClass(".video-time")),
      description: getTextFromClass(".video-description"),
      tags: [],
      views: parseInt(views.replace(/,/g, "")) || undefined,
      author: getTextFromClass(".video-username"),
      authorLink: removeUrlTimestampPrefix(snapshot.timestamp, authorLink),
      videoLink,
      videoId,
      uploadDate: undefined,
      comments: undefined,
      stars: stars !== undefined ? parseFloat(stars) : undefined,
      numRatings: undefined,
      age: undefined,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories: [],
      selectedBy: undefined,
      selectedByLink: undefined,
      featureType,
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};
export const featuredEightScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredContainer = $(
    '.homepage-content-block:contains("Featured Videos")'
  );
  const featuredItems = featuredContainer.find(".video-cell");
  const spotlightContainer = $("#homepage-video-list");
  const spotlightItems = spotlightContainer.find(".video-cell");

  return [
    ...getFeaturedVideos(featuredItems, $, snapshot),
    ...getFeaturedVideos(spotlightItems, $, snapshot, "spotlight"),
  ];
};

import { Cheerio, CheerioAPI, Element } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  getVideoId,
  removeUrlTimestampPrefix,
  safeSplit,
  safeTrim,
} from "../utils";

const findTotalStarRating = ($: CheerioAPI, item: Cheerio<Element>) => {
  const newRatingSystem = item.find(".ratingVS");

  if (newRatingSystem.length) {
    const rating = safeSplit(
      newRatingSystem.first().attr("class"),
      "ratingVS-"
    )[1];
    return parseFloat(rating);
  }
  const fullStars = item.find(".icn_star_full_11x11gif");
  const halfStars = item.find(".icn_star_half_11x11gif");
  return fullStars.length + halfStars.length * 0.5;
};

const getCurriedTextFromClassById =
  (featuredItem: Cheerio<Element>) => (query: string) =>
    safeTrim(featuredItem.find(query).text());

export const featuredSevenScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredItems = $("#homepage-video-list .video-entry");
  const selectedBy =
    safeTrim(safeSplit($("#hpEditorHead").text(), ":")?.[1]) || undefined;
  const selectedByLink =
    safeSplit($("#hpEditorHead a").attr("href"), "http://")?.[1] || undefined;

  const featuredVideos: FeaturedVideo[] = [];
  featuredItems.each((i, el) => {
    const featuredItem = $(el);
    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    const videoId = getVideoId(
      featuredItem.find(".video-long-title a").attr("href")
    );
    const getTextFromClass = getCurriedTextFromClassById(featuredItem);
    const views = getTextFromClass(".video-view-count");

    const featuredVideo = {
      title: getTextFromClass(".video-long-title a"),
      duration: convertDurationToSeconds(getTextFromClass(".video-time")),
      description: getTextFromClass(".video-description"),
      tags: [],
      views: parseInt(views.replace(/,/g, "")) || undefined,
      author: getTextFromClass(".video-username"),
      authorLink: removeUrlTimestampPrefix(
        snapshot.timestamp,
        featuredItem.find(".video-username a").attr("href")
      ),
      videoId,
      uploadDate: undefined,
      comments: undefined,
      stars:
        parseFloat(featuredItem.find(".ratingVS").attr("title") || "0") ||
        findTotalStarRating($, featuredItem),
      numRatings: undefined,
      age: undefined,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories: [],
      selectedBy,
      selectedByLink,
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

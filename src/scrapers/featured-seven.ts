import { Cheerio, CheerioAPI, Element } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  getVideoId,
  safeSplit,
  safeTrim,
} from "../utils";

const getCurriedTextFromClassById =
  (featuredItem: Cheerio<Element>) => (query: string) =>
    safeTrim(featuredItem.find(query).text());

export const featuredSevenScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredItems = $("#homepage-video-list .video-entry");
  const selectedBy =
    safeTrim(safeSplit($("#hpEditorHead").text(), ":")?.[1]) || null;
  const selectedByLink =
    safeSplit($("#hpEditorHead a").attr("href"), "http://")?.[1] || null;

  console.log("*****", { featuredItems: featuredItems.length });
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
console.log("*************herrre")
    const featuredVideo = {
      title: getTextFromClass(".video-long-title a"),
      duration: convertDurationToSeconds(getTextFromClass(".video-time")),
      description: getTextFromClass(".video-description"),
      tags: [],
      views: parseInt(views.replace(",", "")) || null,
      author: getTextFromClass(".video-username"),
      authorLink: featuredItem.find(".video-username").attr("href"),
      videoId,
      uploadDate: null,
      comments: null,
      stars: parseFloat(featuredItem.find(".ratingVS").attr("title") || "0"),
      numRatings: null,
      age: null,
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

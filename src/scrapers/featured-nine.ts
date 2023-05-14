import { Cheerio, CheerioAPI, Element } from "cheerio";
import { Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  safeSplit,
  safeTrim,
  removeUrlTimestampPrefix,
  getVideoId,
} from "../utils";

const parseFeatureType = (id = "") => {
  const lower = id.toLowerCase();
  if (lower.includes("popular")) return "popular";
  if (lower.includes("spotlight")) return "spotlight";
  if (lower.includes("promoted")) return "promoted";
  if (lower.includes("top")) return "top";
  return "featured";
};
const getCurriedTextFromClassById =
  (featuredItem: Cheerio<Element>) => (query: string) =>
    safeTrim(featuredItem.find(query).text());

const getVideoData = (
  videoItem: Element,
  $: CheerioAPI,
  snapshot: Snapshot
) => {
  const featuredItem = $(videoItem);

  const titleElement = featuredItem.find(".video-long-title a").attr("href")
    ? featuredItem.find(".video-long-title a")
    : featuredItem.find(".video-title a");
  const videoLink = removeUrlTimestampPrefix(
    snapshot.timestamp,
    titleElement.attr("href")
  );
  const info = featuredItem.find(".feedmodule-singleform-info div");
  const infoDivs = [...info];
  const authorInfoDiv = $(infoDivs[2]);

  const getTextFromClass = getCurriedTextFromClassById(featuredItem);

  const views =
    getTextFromClass(".video-view-count") || safeTrim($(infoDivs[1]).text());
  const authorLink = removeUrlTimestampPrefix(
    snapshot.timestamp,
    featuredItem.find(".video-username a").attr("href") ||
      authorInfoDiv.find("a").attr("href")
  );

  const stars = featuredItem.find(".ratingVS").attr("title");
  const category = featuredItem.find(".fm2-category-titleText").text();
  console.log({
    duration: getTextFromClass(".video-time"),
  });
  return {
    title:
      getTextFromClass(".video-long-title a") ||
      getTextFromClass(".video-title a"),
    duration: convertDurationToSeconds(getTextFromClass(".video-time")),
    description: getTextFromClass(".video-description"),
    tags: [],
    views:
      parseInt(views.replace(/,/g, "").replace("views", "")) ||
      undefined,
    author:
      getTextFromClass(".video-username") || safeTrim(authorInfoDiv.text()),
    authorLink: removeUrlTimestampPrefix(snapshot.timestamp, authorLink),
    videoLink,
    videoId: getVideoId(videoLink),
    uploadDate: undefined,
    comments: undefined,
    stars: stars !== undefined ? parseFloat(stars) : undefined,
    numRatings: undefined,
    age: getTextFromClass(".video-date-added") || undefined,
    categories: category ? [safeTrim(category)] : [],
  };
};
export const featuredNineScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const content = $("#homepage-main-content");
  const feeds = content.find(".feedmodule-anchor");

  const result: any = [];
  feeds.each((i, feed) => {
    const cheerioFeed = $(feed);
    const title = cheerioFeed.find(".fm2-titleText");
    const feedId = title.attr("id");
    const featureLabel = title.text();
    const guestEditorProfileLink = cheerioFeed.find(
      ".guest-editor-profile-link a"
    );
    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    const sharedDataForAllVideosInFeed = {
      featureType: parseFeatureType(feedId),
      featureLabel,
      selectedBy: guestEditorProfileLink.text() || undefined,
      selectedByLink: removeUrlTimestampPrefix(
        snapshot.timestamp,
        guestEditorProfileLink.attr("href")
      ),
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
    };

    const videosV1 = cheerioFeed.find(".video-cell"); // featured, both types
    const videosV2 = cheerioFeed.find(".feeditem-bigthumb"); // watched now
    const videosV3 = cheerioFeed.find(".feeditem-compressed"); // popular by category

    console.log({
      videosV1: videosV1.length,
      videosV2: videosV2.length,
      videosV3: videosV3.length,
      feed: featureLabel,
    });
    result.push(
      [...videosV1, ...videosV2, ...videosV3]
        .map((video) => ({
          ...getVideoData(video, $, snapshot),
          ...sharedDataForAllVideosInFeed,
        }))
        .flat()
    );
  });

  return result.flat();
};

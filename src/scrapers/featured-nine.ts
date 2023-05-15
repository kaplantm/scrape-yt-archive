import { Cheerio, CheerioAPI, Element } from "cheerio";
import { Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  safeTrim,
  removeUrlTimestampPrefix,
  getVideoId,
  getSimpleProfileUsernameUrl,
  getSimpleVideoIdUrl,
} from "../utils";

const avoidPlaylistList = (link: string | undefined, videoId: string) =>
  !link || link.includes("watch_videos?") ? getSimpleVideoIdUrl(videoId) : link;

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

const getMainVideoData = (
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
  const category =
    featuredItem.find(".fm2-category-titleText").text() ||
    featuredItem.find(".feeditem-compressed-category-title").text();

  const videoIdFromLink = getVideoId(videoLink);
  const videoIdClass = featuredItem
    .find(".video-main-content")
    .attr("id")
    ?.replace("video-main-content-", "");
  // some videos link to playlists, so their id isn't clear from link
  const videoId = videoIdFromLink || videoIdClass;
  return {
    title:
      getTextFromClass(".video-long-title a") ||
      getTextFromClass(".video-title a"),
    duration: convertDurationToSeconds(getTextFromClass(".video-time")),
    description: getTextFromClass(".video-description"),
    tags: [],
    views: parseInt(views.replace(/,/g, "").replace("views", "")) || undefined,
    author:
      getTextFromClass(".video-username") || safeTrim(authorInfoDiv.text()),
    authorLink: removeUrlTimestampPrefix(snapshot.timestamp, authorLink),
    videoLink: avoidPlaylistList(videoLink, videoId),
    videoId,
    uploadDate: undefined,
    comments: undefined,
    stars: stars !== undefined ? parseFloat(stars) : undefined,
    numRatings: undefined,
    age: getTextFromClass(".video-date-added") || undefined,
    categories: category ? [safeTrim(category)] : [],
  };
};

const getSidebarVideoData = (
  videoItem: Element,
  $: CheerioAPI,
  snapshot: Snapshot
) => {
  const featuredItem = $(videoItem);

  const videoLinkElement = featuredItem.find(".video-list-item-link");
  const videoLink = removeUrlTimestampPrefix(
    snapshot.timestamp,
    videoLinkElement.attr("href")
  );
  const info = featuredItem.find(".stat");
  const infoDivs = [...info];
  const author = safeTrim($(infoDivs[0]).text()).replace(/^by /g, "");

  const getTextFromClass = getCurriedTextFromClassById(featuredItem);
  const views =
    getTextFromClass(".view-count") || safeTrim($(infoDivs[1]).text());

    const videoIdFromLink = getVideoId(videoLink);
    const videoIdClass = featuredItem
      .find(".video-main-content")
      .attr("id")
      ?.replace("video-main-content-", "");
    // some videos link to playlists, so their id isn't clear from link
    const videoId = videoIdFromLink || videoIdClass;
  return {
    title: getTextFromClass(".title"),
    duration: convertDurationToSeconds(getTextFromClass(".video-time")),
    description: getTextFromClass(".video-description"),
    tags: [],
    views: parseInt(views.replace(/,/g, "").replace("views", "")) || undefined,
    author,
    authorLink: getSimpleProfileUsernameUrl(author), // authors not linked for sidebar videos
    videoLink: avoidPlaylistList(videoLink, videoId),
    videoId,
    uploadDate: undefined,
    comments: undefined,
    stars: undefined,
    numRatings: undefined,
    age: getTextFromClass(".video-date-added") || undefined,
    categories: [],
  };
};

const getMainContentVideos = (
  feeds: Element[],
  $: CheerioAPI,
  snapshot: Snapshot,
  sharedData: any
) =>
  feeds
    .map((feed) => {
      const cheerioFeed = $(feed);
      const title = cheerioFeed.find(".fm2-titleText");
      const feedId = title.attr("id");
      const featureLabel = title.text();

      // Reccomended videos don't have authors so we can't save them - and they are custom anyway
      if (featureLabel.includes("Recommended")) return;

      const guestEditorProfileLink = cheerioFeed.find(
        ".guest-editor-profile-link a"
      );

      const sharedDataForAllVideosInFeed = {
        featureType: parseFeatureType(feedId),
        featureLabel,
        selectedBy: guestEditorProfileLink.text() || undefined,
        selectedByLink: removeUrlTimestampPrefix(
          snapshot.timestamp,
          guestEditorProfileLink.attr("href")
        ),
        ...sharedData,
      };

      const videosV1 = cheerioFeed.find(".video-cell"); // featured, both types
      const videosV2 = cheerioFeed.find(".feeditem-bigthumb"); // watched now
      const videosV3 = cheerioFeed.find(".feeditem-compressed"); // popular by category

      return [...videosV1, ...videosV2, ...videosV3].map((video) => ({
        ...getMainVideoData(video, $, snapshot),
        ...sharedDataForAllVideosInFeed,
      }));
    })
    .flat()
    .flat();

const getSideBarVideos = (
  feeds: Element[],
  $: CheerioAPI,
  snapshot: Snapshot,
  sharedData: any
) =>
  feeds
    .map((feed) => {
      const cheerioFeed = $(feed);
      const title = cheerioFeed.find("h2");
      const feedId = title.attr("id");
      const featureLabel = title.text();

      // Reccomended videos don't have authors so we can't save them - and they are custom anyway
      if (featureLabel.includes("Recommended")) return;

      const guestEditorProfileLink = cheerioFeed.find(
        ".guest-editor-profile-link a"
      );

      const sharedDataForAllVideosInFeed = {
        featureType: parseFeatureType(feedId),
        featureLabel,
        selectedBy: guestEditorProfileLink.text() || undefined,
        selectedByLink: removeUrlTimestampPrefix(
          snapshot.timestamp,
          guestEditorProfileLink.attr("href")
        ),
        ...sharedData,
      };

      const videosV1 = cheerioFeed.find(".video-list-item"); // sidebar video

      return [...videosV1].map((video) => ({
        ...getSidebarVideoData(video, $, snapshot),
        ...sharedDataForAllVideosInFeed,
      }));
    })
    .flat()
    .flat();

export const featuredNineScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const content = $("#homepage-main-content");
  const feeds = content.find(".feedmodule-anchor");

  const sideContent = $("#homepage-side-content");
  const sidebarFeeds = sideContent.find(".homepage-side-block");

  const date = new Date(getISOStringFromWaybackTimestamp(snapshot.timestamp));
  const sharedDataForAllVideosOnPage = {
    dateFeaturedEpoch: date.getTime(),
    dateFeatured: `${date.toUTCString()}`,
    timestampFeatured: snapshot.timestamp,
  };
  // const mainContentVideos = getMainContentVideos([...feeds], $, snapshot, sharedDataForAllVideosOnPage)
  const sideBarVideos = getSideBarVideos(
    [...sidebarFeeds],
    $,
    snapshot,
    sharedDataForAllVideosOnPage
  );

  return [...sideBarVideos];
  // return [...mainContentVideos, ...sideBarVideos];
};

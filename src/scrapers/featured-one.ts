import { CheerioAPI } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  getISOStringFromWaybackTimestamp,
  getVideoId,
  removeUrlTimestampPrefix,
  safeSplit,
  safeTrim,
} from "../utils";

export const featuredOneScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredItems = $(".moduleFeatured td");

  const featuredVideos: FeaturedVideo[] = [];
  featuredItems.each((i, el) => {
    const featuredItem = $(el);
    const [details1, details2] = featuredItem.children(
      ".moduleFeaturedDetails"
    );
    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    // upload date and author are in same parent element
    // early versions put upload date like this:
    //     Added: April 24, 2005
    //     By: BootieChrist
    // later version is like this:
    //     Added: July 7, 2005
    //     by caronwo

    const uploadDate = $(details1).text().trim().split("Added: ")[1];

    const [uploadDateWithoutAuthor, authorFromUploadDate] = (uploadDate || "")
      .replace("By:", "by")
      .split("by");
    const authorLink = removeUrlTimestampPrefix(
      snapshot.timestamp,
      featuredItem.find(".moduleFeaturedDetails a").attr("href"),
      true
    );
    const [viewsText, commentsText] = $(details2).text().split("|");

    const comments = parseInt((commentsText || "").split("Comments: ")[1]);
    const featuredVideo = {
      title: featuredItem.children(".moduleFeaturedTitle").text().trim(),
      views: parseInt(safeSplit(viewsText, "Views: ")[1]) || undefined,
      author: safeTrim(authorFromUploadDate),
      authorUsername: authorLink?.split("=")[authorLink?.split("=").length],
      authorLink,
      videoId: getVideoId(featuredItem.children("a").attr("href")),
      uploadDate: safeTrim(uploadDateWithoutAuthor),
      comments: comments >= 0 ? comments : undefined,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      description: "",
      tags: [],
      duration: undefined,
      age: undefined,
      stars: undefined,
      categories: [],
      numRatings: undefined,
      selectedBy: undefined,
      selectedByLink: undefined,
    };
    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

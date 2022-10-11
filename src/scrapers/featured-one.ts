import { CheerioAPI } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import { getISOStringFromWaybackTimestamp } from "../utils";

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

    const [uploadDate, author] = $(details1)
      .text()
      .trim()
      .split("Added: ")[1]
      .split(" by\n");

    const [viewsText, commentsText] = $(details2).text();

    const featuredVideo = {
      title: featuredItem.children(".moduleFeaturedTitle").text().trim(),
      views: parseInt((viewsText || "").split("Views: ")[1]) || 0,
      author: (author || "").trim(),
      videoId:
        featuredItem.children("a").attr("href")?.split("v=")[1].split("&")[0] ||
        "",
      uploadDate: (uploadDate || "").trim(),
      comments: parseInt((commentsText || "").split("Comments: ")[1]) || 0,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
    };
    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

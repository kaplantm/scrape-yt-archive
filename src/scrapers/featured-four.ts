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

// TODO: DRY?
const findTotalStarRating = ($: CheerioAPI, item: Cheerio<Element>) => {
  let totalRating: number | undefined = undefined;
  item.find("nobr img.rating").each((i, el) => {
    const src = $(el).attr("src");
    if (src && !src.includes("star_sm_bg.gif")) {
      if (!totalRating) {
        totalRating = 0;
      }
      totalRating += src.includes("/star_sm.gif") ? 1 : 0.5;
    }
  });
  return totalRating;
};

export const featuredFourScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredItems = $(".vListBox .vTable");

  const featuredVideos: FeaturedVideo[] = [];
  featuredItems.each((i, el) => {
    const featuredItem = $(el).find(".vinfo");

    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    const title = featuredItem.find(".vtitle");

    const facets = safeTrim(featuredItem.find(".vfacets").text());
    const tags = safeSplit(
      safeSplit(safeSplit(facets, "Tags:\n")[1], "Added:")[0],
      "   "
    )
      .map((el) => safeTrim(el))
      .filter((el) => el);

    const age = safeSplit(safeSplit(facets, "Added:")[1], "\n")[0];
    const categories = safeSplit(safeSplit(facets, "in Category:")[1], "\n")[0];

    const facetLinks = featuredItem.find(".vfacets");
    const authorLink = removeUrlTimestampPrefix(
      snapshot.timestamp,
      facetLinks.children("a").last().attr("href")
    );
    const author = safeSplit(safeSplit(facets, "From:")[1], "\n")[0];

    const views = safeSplit(safeSplit(facets, "Views:")[1], "\n")[0];

    const videoLink = removeUrlTimestampPrefix(
      snapshot.timestamp,
      title.find("a").attr("href")
    );
    const videoId = getVideoId(videoLink);
    const moreDescription = featuredItem
      .find(`#RemainvidDesc${videoId}`)
      .removeAttr("style")
      .text();

    const featuredVideo = {
      title: safeTrim(safeSplit(safeTrim(title.text()), "\n")[0]),
      duration: convertDurationToSeconds(
        safeTrim(featuredItem.find(".runtime").text())
      ),
      description: safeTrim(
        moreDescription || featuredItem.find(".vdesc").text()
      ),
      tags,
      views: parseInt(views.replace(/,/g, "")) || undefined,
      author: safeTrim(author),
      authorLink: removeUrlTimestampPrefix(snapshot.timestamp, authorLink),
      videoId,
      videoLink,
      uploadDate: undefined,
      comments: undefined,
      stars: findTotalStarRating($, featuredItem),
      numRatings: parseInt(
        featuredItem.find("div.rating").last().text() || "0"
      ),
      age: safeTrim(age),
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories: safeSplit(categories, " ").map((el) => safeTrim(el)),
      selectedBy: undefined,
      selectedByLink: undefined,
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

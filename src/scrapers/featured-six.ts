import { Cheerio, CheerioAPI, Element } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  getVideoId,
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

export const featuredSixScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredItems = $("#hpFeatured .vlentry");
  const selectedBy =
    safeTrim(safeSplit($("#hpEditorHead").text(), ":")?.[1]) || null;
  const selectedByLink =
    safeSplit($("#hpEditorHead a").attr("href"), "http://")?.[1] || null;

  const featuredVideos: FeaturedVideo[] = [];
  featuredItems.each((i, el) => {
    const featuredItem = $(el);
    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);
    const title = featuredItem.find(".vllongTitle a");
    const facets = safeTrim(featuredItem.find(".vlfacets").text());
    const info = safeTrim(featuredItem.find(".vInfo").text());

    const categories = safeTrim(
      safeSplit(featuredItem.find(".vlfacets .vlcategory").text(), "More in")[1]
    );

    const author = safeSplit(safeSplit(facets || info, "From:")[1], "\n")[0];

    const views = safeSplit(safeSplit(facets || info, "Views:")[1], "\n")[0];

    const videoId = getVideoId(title.attr("href"));
    const description = featuredItem.find(".vldesc").text();
    const moreDescription = featuredItem
      .find(`#RemainvidDesc${videoId}`)
      .removeAttr("style")
      .text();

    const featuredVideo = {
      title: safeTrim(safeSplit(safeTrim(title.text()), "\n")[0]),
      duration: convertDurationToSeconds(
        safeTrim(featuredItem.find(".runtime").text())
      ),
      description: safeTrim(moreDescription || description),
      tags: [],
      views: parseInt(views.replace(",", "")) || null,
      author: safeTrim(author),
      videoId,
      uploadDate: null,
      comments: null,
      stars: findTotalStarRating($, featuredItem),
      numRatings: null,
      age: null,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories: safeSplit(categories, " ").map((el) => safeTrim(el)),
      selectedBy,
      selectedByLink,
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

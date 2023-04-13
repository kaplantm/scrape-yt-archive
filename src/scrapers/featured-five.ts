import { Cheerio, CheerioAPI, Element } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  getVideoId,
  safeSplit,
  safeTrim,
} from "../utils";

const findTotalStarRatingV1 = ($: CheerioAPI, item: Cheerio<Element>) => {
  let totalRating: number | undefined = undefined;
  item.find("img.rating").each((i, el) => {
    const src = $(el).attr("src");
    if (
      src &&
      !src.includes("star_sm_bg.gif") &&
      !src.includes("_off") &&
      !src.includes("_empty")
    ) {
      if (!totalRating) {
        totalRating = 0;
      }
      totalRating += src.includes("half") ? 0.5 : 1;
    }
  });
  return totalRating;
};

const findTotalStarRating = ($: CheerioAPI, item: Cheerio<Element>) => {
  const fullStars = item.find(".icn_star_full_11x11gif");
  const halfStars = item.find(".icn_star_half_11x11gif");

  const ratingUsingNewApproach = fullStars.length + halfStars.length * 0.5;
  if (ratingUsingNewApproach) {
    return ratingUsingNewApproach;
  }
  return findTotalStarRatingV1($, item);
};

export const featuredFiveScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const v1FeaturedItems = $("#hpFeaturedList .vEntry");
  const v2featuredItems = $("#hpFeatured .vEntry");
  const featuredItems = v1FeaturedItems?.length
    ? v1FeaturedItems
    : v2featuredItems;
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
    const title = featuredItem.find(".vtitle");
    const facets = safeTrim(featuredItem.find(".vfacets").text());
    const info = safeTrim(featuredItem.find(".vInfo").text());

    const categoriesV1 = featuredItem.find(".vfacets .hpVfacetRight").text();
    const categoriesV2 = featuredItem.find(".vMore").text();
    const categories = safeTrim(
      safeSplit(categoriesV1 || categoriesV2, "More in")[1]
    );

    const author = safeSplit(safeSplit(facets || info, "From:")[1], "\n")[0];

    const views = safeSplit(safeSplit(facets || info, "Views:")[1], "\n")[0];

    const videoId = getVideoId(title.find("a").attr("href"));
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
        moreDescription ||
          featuredItem
            .find(".vdesc")
            .text()
            .split("(more)\n                (less)")[0]
      ),
      tags: [],
      views: parseInt(views.replace(",", "")) || undefined,
      author: safeTrim(author),
      authorLink: featuredItem.find(".video-username").attr("href"),
      videoId,
      uploadDate: undefined,
      comments: undefined,
      stars: findTotalStarRating($, featuredItem),
      numRatings: undefined,
      age: undefined,
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

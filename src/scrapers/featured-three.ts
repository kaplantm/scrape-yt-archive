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

export const featuredThreeScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredItems = $(".vDetailEntry");

  const featuredVideos: FeaturedVideo[] = [];
  featuredItems.each((i, el) => {
    const featuredItem = $(el).find(".vListInfo1Still");

    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    const title = featuredItem.find(".title");
    const tags = safeSplit(
      safeSplit(featuredItem.find(".tagTable td").text(), "Tags:")[1],
      " "
    )
      .map((el) => safeTrim(el))
      .filter((el) => el);

    const [age, author, views] = safeSplit(
      safeSplit(featuredItem.find(".facets").text(), "Added:")[1],
      "\n"
    );

    const [ageWithoutCategory, categories] = age.split("in Category:");

    const videoLink = removeUrlTimestampPrefix(
      snapshot.timestamp,
      title.find("a").attr("href")
    );
    const videoId = getVideoId(videoLink);

    const moreDescription = featuredItem
      .find(`#RemainvidDesc${videoId}`)
      .removeAttr("style")
      .text();

    console.log("***8*** a ", featuredItem.find(".facets > a"));
    const featuredVideo = {
      title: safeTrim(safeSplit(safeTrim(title.text()), "\n")[0]),
      duration: convertDurationToSeconds(
        safeTrim(featuredItem.find(".runtime").text())
      ),
      description: safeTrim(
        moreDescription || featuredItem.find(".desc").text()
      ),
      tags,
      views:
        parseInt(safeSplit(views, "Views: ")[1].replace(",", "")) || undefined,
      author: safeTrim(safeSplit(author, "From:")[1]),
      authorLink: removeUrlTimestampPrefix(
        snapshot.timestamp,
        featuredItem.find(".facets > a").attr("href")
      ),
      videoId,
      videoLink,
      uploadDate: undefined,
      comments: undefined,
      stars: findTotalStarRating($, featuredItem),
      numRatings: parseInt(featuredItem.find("div.rating").text() || "0"),
      age: safeTrim(ageWithoutCategory),
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories:
        safeSplit(categories, " ").map((el) => safeTrim(el)) || undefined,
      selectedBy: undefined,
      selectedByLink: undefined,
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

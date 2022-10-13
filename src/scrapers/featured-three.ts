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
  let totalRating: number | null = null;
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

    const featuredVideo = {
      title: safeTrim(safeSplit(safeTrim(title.text()), "\n")[0]),
      duration: convertDurationToSeconds(
        safeTrim(featuredItem.find(".runtime").text())
      ),
      description: safeTrim(featuredItem.find(".desc").text()),
      tags,
      views: parseInt(safeSplit(views, "Views: ")[1].replace(",", "")) || null,
      author: safeTrim(safeSplit(author, "From:")[1]),
      videoId: getVideoId(title.find("a").attr("href")),
      uploadDate: undefined,
      comments: null,
      stars: findTotalStarRating($, featuredItem),
      numRatings: parseInt(featuredItem.find("div.rating").text() || "0"),
      age: safeTrim(ageWithoutCategory),
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories: safeSplit(categories, " ").map((el) => safeTrim(el)),
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

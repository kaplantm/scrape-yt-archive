import { CheerioAPI } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  getVideoId,
  safeSplit,
  safeTrim,
} from "../utils";

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

    const author = safeSplit(safeSplit(facets, "From:\n")[1], "\n")[0];
    const views = safeSplit(safeSplit(facets, "Views:")[1], "\n")[0];

    let totalRating: number | undefined = undefined;
    featuredItem.find("nobr img.rating").each((i, el) => {
      const src = $(el).attr("src");
      if (
        src &&
        src !==
          "/web/20060502203540im_/http://www.youtube.com/img/star_sm_bg.gif"
      ) {
        if (!totalRating) {
          totalRating = 0;
        }
        totalRating +=
          src ===
          "/web/20060502203540im_/http://www.youtube.com/img/star_sm.gif"
            ? 1
            : 0.5;
      }
    });

    const featuredVideo = {
      title: safeTrim(safeSplit(safeTrim(title.text()), "\n")[0]),
      duration: convertDurationToSeconds(
        safeTrim(featuredItem.find(".runtime").text())
      ),
      description: safeTrim(featuredItem.find(".vdesc").text()),
      tags,
      views: parseInt(views.replace(",", "")) || null,
      author: safeTrim(author),
      videoId: getVideoId(title.find("a").attr("href")),
      uploadDate: undefined,
      comments: null,
      stars: totalRating || 0,
      numRatings: parseInt(featuredItem.find("div.rating").text() || "0"),
      age: safeTrim(age),
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      categories: safeSplit(categories, "\n").map((el) => safeTrim(el)),
    };

    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

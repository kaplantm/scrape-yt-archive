import { Cheerio, CheerioAPI, Element } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  convertDurationToSeconds,
  getISOStringFromWaybackTimestamp,
  getVideoId,
  safeSplit,
  safeTrim,
} from "../utils";

// starts only appear sometimes
// https://web.archive.org/web/20050822154924/http://www.youtube.com/ - run time and stars
const findTotalStarRating = ($: CheerioAPI, item: Cheerio<Element>) => {
  let totalRating: number | undefined = undefined;
  const found = item.find("nobr img.rating");
  console.log("****", found);
  item.find("nobr img").each((i, el) => {
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

export const featuredTwoScraper = ($: CheerioAPI, snapshot: Snapshot) => {
  const featuredItemsTd = $("td").filter(function () {
    return $(this).text().includes("Featured Videos");
  });
  const featuredItems = $(featuredItemsTd).children(".moduleEntry");

  const featuredVideos: FeaturedVideo[] = [];
  featuredItems.each((i, el) => {
    const featuredItem = $(el);

    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    const title = featuredItem.find(".moduleEntryTitle");
    const [details1, details2] = featuredItem.find(".moduleEntryDetails");
    const [addedText, byText] = safeSplit($(details1).text(), "by");

    // duration (runtime) only appears sometimes
    // https://web.archive.org/web/20050815011340/http://www.youtube.com/ - runtime but no stars
    const splitDetails2 = safeSplit($(details2).text(), " | ");
    const durationText = safeTrim(
      splitDetails2.length === 3 ? splitDetails2[0] : ""
    );
    const viewsText = safeTrim(
      splitDetails2.length === 3 ? splitDetails2[1] : splitDetails2[0]
    );
    const commentsText = safeTrim(
      splitDetails2.length === 3 ? splitDetails2[2] : splitDetails2[1]
    );

    const comments = parseInt(
      safeTrim(safeSplit(commentsText, "Comments: ")[1])
    );

    const tagsText = featuredItem.find(".moduleEntryTags").text();
    const tags = safeSplit(safeSplit(tagsText, "Tags //")[1], ":").map((el) =>
      safeTrim(el)
    );

    const featuredVideo = {
      title: safeTrim(title.text()),
      description: safeSplit(
        featuredItem.find(".moduleEntryDescription").text(),
        "\n"
      )
        .map((el) => safeTrim(el))
        .join(" ")
        .trim(),
      tags: tags.filter((el) => el),
      views: parseInt(safeSplit(viewsText, "Views: ")[1]) || undefined,
      author: safeTrim(byText),
      authorLink: featuredItem.find(".video-username").attr("href"),
      videoId: getVideoId(title.children("a").attr("href")),
      uploadDate: safeTrim(safeSplit(addedText, "Added:")?.[1]),
      comments: comments >= 0 ? comments : undefined,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
      age: undefined,
      categories: [],
      duration: convertDurationToSeconds(
        safeTrim(safeSplit(durationText, "Runtime:")[1])
      ),
      stars: findTotalStarRating($, featuredItem),
      numRatings: undefined,
      selectedBy: undefined,
      selectedByLink: undefined,
    };
    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

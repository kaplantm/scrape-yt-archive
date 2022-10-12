import { CheerioAPI } from "cheerio";
import { FeaturedVideo, Snapshot } from "../types";
import {
  getISOStringFromWaybackTimestamp,
  getVideoId,
  safeSplit,
  safeTrim,
} from "../utils";

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
    const [viewsText, commentsText] = safeSplit($(details2).text(), " | ");

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
      views: parseInt(safeSplit(viewsText, "Views: ")[1]) || null,
      author: safeTrim(byText),
      videoId: getVideoId(title.children("a").attr("href")),
      uploadDate: safeTrim(safeSplit(addedText, "Added:")?.[1]),
      comments: comments >= 0 ? comments : null,
      dateFeaturedEpoch: date.getTime(),
      dateFeatured: `${date.toUTCString()}`,
      timestampFeatured: snapshot.timestamp,
    };
    console.log({ featuredVideo });
    featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

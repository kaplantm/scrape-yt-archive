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
    const [thumb, featuredItemTd] = featuredItem.children("table tbody tr td");

    const isoDateFeatured = getISOStringFromWaybackTimestamp(
      snapshot.timestamp
    );
    const date = new Date(isoDateFeatured);

    const title = featuredItem.find(".moduleEntryTitle");
    const [details1, details2] = featuredItem.find(".moduleEntryDetails");
    const [addedText, byText] = safeSplit($(details1).text(), "by\n");
    const [viewsText, commentsText] = safeSplit($(details2).text(), " | ");

    console.log({ commentsText });

    const comments = parseInt(
      safeTrim(safeSplit(commentsText, "Comments: ")[1])
    );
    console.log("***featured-two", {
      title: safeTrim(title.text()),
      description: safeSplit(
        featuredItem.find(".moduleEntryDescription").text(),
        "\n"
      )
        .map((el) => safeTrim(el))
        .join(" ")
        .trim(),
      tags: featuredItem
        .find(".moduleEntryTags")
        .text()
        .split("Tags //\n ")[1]
        .split(":\n")
        .map((el) => safeTrim(el))
        .filter((el) => el),
      views: parseInt(safeSplit(viewsText, "Views: ")[1]) || null,
      author: safeTrim(byText),
      videoId: getVideoId(title.children("a").attr("href")),
      uploadDate: safeTrim(safeSplit(addedText, "Added:")?.[1]),
      comments: comments >= 0 ? comments : null,
      // dateFeaturedEpoch: date.getTime(),
      // dateFeatured: `${date.toUTCString()}`,
      // timestampFeatured: snapshot.timestamp,
    });
    //   const featuredVideo = {
    // title: safeTrim(title.text()),
    // description: safeTrim(
    //   featuredItem.children(".moduleEntryDescription").text()
    // ),
    // tags: featuredItem
    //   .children(".moduleEntryTags")
    //   .text()
    //   .split(" : ")
    //   .map((el) => safeTrim(el)),
    // views: parseInt(safeSplit(viewsText, "Views: ")[1]) || null,
    // author: safeTrim(authorFromUploadDate) || safeTrim(author),
    // videoId: getVideoId(title.children("a").attr("href")),
    // uploadDate: safeTrim(uploadDateWithoutAuthor),
    // comments: parseInt((commentsText || "").split("Comments: ")[1]) || null,
    // dateFeaturedEpoch: date.getTime(),
    // dateFeatured: `${date.toUTCString()}`,
    // timestampFeatured: snapshot.timestamp,
    //   };
    //   featuredVideos.push(featuredVideo);
  });
  return featuredVideos;
};

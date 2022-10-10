import axios from "axios";
import { load } from "cheerio";
// import { eras } from "./constants";
import { CheckedStatus, FeaturedVideo, Snapshot } from "./types";
import {
  allSynchronously,
  getISOStringFromWaybackTimestamp,
  getWaybackUrl,
} from "./utils";

const scrapeTarget = async (snapshot: Snapshot) => {
  // const scraper = eras[snapshot.EraName].scraper;

  try {
    const { data } = await axios.get(getWaybackUrl(snapshot.timestamp));
    // Load HTML we fetched in the previous line
    const $ = load(data); // cheerioData
    // Select all the list items in plainlist class
    // const featuredItem = $(".moduleFeatured td");

    const featuredItems = $(".moduleFeatured td");

    // listItems.each((idx, el) => {
    //   // Object holding data for each country/jurisdiction
    //   const country = { name: "", iso3: "" };
    //   // Select the text content of a and span elements
    //   // Store the textcontent in the above object
    //   country.name = $(el).children("a").text();
    //   country.iso3 = $(el).children("span").text();
    //   // Populate countries array with country data
    //   countries.push(country);
    // });

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

      featuredVideos.push({
        title: featuredItem.children(".moduleFeaturedTitle").text(),
        views: parseInt($(details2).text()) || 0, // TODO: now split
        author: $(details1).text(), // TODO: now split
        thumbnail: featuredItem.children("a img").attr("src") || "",
        url: featuredItem.children("a").attr("href") || "",
        uploadDate: $(details1).text(), // TODO: now split
        comments: parseInt($(details2).text()) || 0, // TODO: now split
        dateFeaturedEpoch: `${date.getTime()}`,
        dateFeatured: `${date.toUTCString()}`,
        timestampFeatured: snapshot.timestamp,
      });
    });

    return { ...snapshot, checked: CheckedStatus, featuredVideos };
  } catch (e) {
    console.error({ e });
    return { ...snapshot, checked: CheckedStatus.FAILED };
  }
};
export const scrapeTargets = async (targets: Snapshot[]) => {
  const map = targets.map((target) => () => scrapeTarget(target));
  const results = await allSynchronously(map);
  console.log("***", results);
};

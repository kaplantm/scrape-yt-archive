import axios from "axios";
import { load } from "cheerio";
import { mockYoutubeFeatured1 } from "./mocks/youtube";
import { eras } from "./constants";
import { CheckedStatus, Snapshot } from "./types";
import { allSynchronously, getWaybackUrl, sleep } from "./utils";

const scrapeTarget = async (snapshot: Snapshot) => {
  const scraper = eras[snapshot.eraName].scraper;

  try {
    await sleep();
    console.log("**** scraping", snapshot);
    const { data } = await axios.get(getWaybackUrl(snapshot.timestamp));
    // const data = mockYoutubeFeatured1;
    const $ = load(data);

    return {
      ...snapshot,
      checked: CheckedStatus.FOUND,
      featuredVideos: scraper($, snapshot),
    };
  } catch (e) {
    console.error({ e });
    return { ...snapshot, checked: CheckedStatus.FAILED };
  }
};
export const scrapeTargets = async (targets: Snapshot[]) => {
  const map = targets.map(
    (target) => () =>
      target.checked === CheckedStatus.FOUND ? target : scrapeTarget(target)
  );
  const results = await allSynchronously(map);
  console.log("***", results);
  return results;
};

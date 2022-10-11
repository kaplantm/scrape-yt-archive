import axios from "axios";
import { load } from "cheerio";
import { mockYoutubeFeatured1 } from "./mocks/youtube";
import { eras } from "./constants";
import { CheckedStatus, Snapshot } from "./types";
import { allSynchronously, getWaybackUrl, sleep } from "./utils";

const scrapeTarget = async (snapshot: Snapshot) => {
  const scraper = eras[snapshot.eraName].scraper;

  if (!scraper) {
    return snapshot;
  }

  try {
    console.log("**** scraping", snapshot);
    // await sleep();
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

export const processTarget = async (
  target: Snapshot,
  onTargetScraped: (snapshot: Snapshot) => void
) => {
  const snapshot = await scrapeTarget(target);
  onTargetScraped(snapshot);
  return snapshot;
};

export const scrapeTargets = async (
  targets: Snapshot[],
  onTargetScraped: (snapshot: Snapshot) => void
) => {
  const map = targets.map(
    (target) => () =>
      target.checked !== CheckedStatus.FOUND
        ? processTarget(target, onTargetScraped)
        : target
  );
  const results = await allSynchronously(map);
  console.log("***", results);
  return results;
};

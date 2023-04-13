import axios from "axios";
import { load } from "cheerio";
import { featureMocks } from "./mocks/youtube";
import { eras } from "./constants";
import { CheckedStatus, eraName, Snapshot } from "./types";
import {
  allSynchronously,
  getWaybackUrl,
  sleep,
  targetLimit,
  mockTargets,
  onlyFeature,
} from "./utils";

const scrapeTarget = async (snapshot: Snapshot) => {
  console.log("snapshot.eraName", snapshot.eraName)
  const scraper = eras[snapshot.eraName]?.scraper;

  if (!scraper) {
    return snapshot;
  }

  try {
    console.log("**** scraping", snapshot.timestamp);

    const mock = mockTargets ? featureMocks[snapshot.eraName] : undefined;

    if (process.env.MOCK && !mock) {
      throw new Error(`missing mock for ${snapshot.eraName}`);
    }

    let data = mock;

    if (!data) {
      // await sleep();
      data = (await axios.get(getWaybackUrl(snapshot.timestamp)))?.data;
    }

    if (!data) {
      throw new Error(`no data found for snapshot ${snapshot.timestamp}`);
    }

    const $ = load(data);

    console.log("scraped - found", snapshot.timestamp);
    return {
      ...snapshot,
      checked: CheckedStatus.FOUND,
      featuredVideos: scraper($, snapshot),
    };
  } catch (e) {
    console.log("scraped - failed", snapshot.timestamp);
    console.error({ e });
    return { ...snapshot, checked: CheckedStatus.FAILED };
  }
};

export const processTarget = async (
  target: Snapshot,
  onTargetScraped: (snapshot: Snapshot) => void
) => {
  const snapshot = await scrapeTarget(target);
  // console.log("done scrape", snapshot);
  onTargetScraped(snapshot);
  return snapshot;
};

export const scrapeTargets = async (
  targets: Snapshot[],
  onTargetScraped: (snapshot: Snapshot) => void
) => {
    // const selectedTargets = targetLimit ? targets.slice(0, targetLimit) : targets;

    const selectedTargets = targets.slice(0, 1);

    const map = selectedTargets.map((target) => () => {
      // const shouldCheck = onlyFeature
      //   ? selectedTargets[0].eraName === eraName[onlyFeature as eraName]
      //   : selectedTargets[0].checked !== CheckedStatus.FOUND;
      // && parseInt(target.timestamp) > 20080514215055
      // return shouldCheck ? processTarget(target, onTargetScraped) : target;
      return processTarget(target, onTargetScraped);
    });
    const results = await allSynchronously(map);

    return results;
};

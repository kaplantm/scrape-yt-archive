import axios from "axios";
import { load } from "cheerio";
import { featureMocks } from "./mocks/youtube";
import { eras } from "./constants";
import { CheckedStatus, eraName, Snapshot } from "./types";
import { allSynchronously, getWaybackUrl, sleep, targetLimit, mockTargets, onlyFeature } from "./utils";

const scrapeTarget = async (snapshot: Snapshot) => {
  console.log("snapshot.eraName", snapshot.eraName);
  const scraper = eras[snapshot.eraName]?.scraper;

  if (!scraper) {
    return snapshot;
  }

  try {
    const mock = mockTargets ? featureMocks[snapshot.eraName] : undefined;

    if (process.env.MOCK && !mock) {
      throw new Error(`missing mock for ${snapshot.eraName}`);
    }

    let data = mock;

    if (!data) {
      console.log(`////////// STARTING wayback request for ${snapshot.timestamp} //////////`);
      // await sleep();
      data = (await axios.get(getWaybackUrl(snapshot.timestamp)))?.data;
    }

    if (!data) {
      console.log(`////////// COMPLETED wayback request for ${snapshot.timestamp} - ERROR //////////`);
      throw new Error(`no data found for snapshot ${snapshot.timestamp}`);
    }

    const $ = load(data);
    console.log(`////////// COMPLETED wayback request for ${snapshot.timestamp} - SUCCESS //////////`);
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

export const processTarget = async (target: Snapshot, onTargetScraped: (snapshot: Snapshot) => void) => {
  const snapshot = await scrapeTarget(target);
  // console.log("done scrape", snapshot);
  onTargetScraped(snapshot);
  return snapshot;
};

export const scrapeTargets = async (targets: Snapshot[], onTargetScraped: (snapshot: Snapshot) => void) => {
  const selectedTargets = targetLimit ? targets.slice(0, targetLimit) : targets;

  // const map = selectedTargets.map((target) => () => {
  //   // const shouldCheck = onlyFeature
  //   //   ? selectedTargets[0].eraName === eraName[onlyFeature as eraName]
  //   //   : selectedTargets[0].checked !== CheckedStatus.FOUND;
  //   // && parseInt(target.timestamp) > 20080514215055
  //   // return shouldCheck ? processTarget(target, onTargetScraped) : target;
  //   return processTarget(target, onTargetScraped);
  // });

  const map = selectedTargets.map((target) => async () => {
    const shouldCheck = onlyFeature
      ? target.eraName === eraName[onlyFeature as eraName]
      : target.checked !== CheckedStatus.FOUND;

    let foundInstancesCount = 0;
    try {
      console.log(`////////// START check if already scraped  ${target.timestamp} //////////`);
      const result =  await axios.get(`http://localhost:3000/api/video-scrape-instances?timestamp=${target.timestamp}`);
      console.log({result: result.data?.length})
      foundInstancesCount = (
        await axios.get(`http://localhost:3000/api/video-scrape-instances?timestamp=${target.timestamp}`)
      )?.data?.length;
      console.log(`////////// ${foundInstancesCount ? "FOUND" : "NOT FOUND"} ${target.timestamp} //////////`);
    } catch (e) {
      console.log(`////////// NOT FOUND - Error ${target.timestamp} //////////`);
    }

    return shouldCheck && !foundInstancesCount ? processTarget(target, onTargetScraped) : target;
  });
  const results = await allSynchronously(map);

  return results;
};

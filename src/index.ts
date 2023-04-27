import fs from "fs";
import path from "path";
import { filePaths } from "./constants";
import { genSnapshotsList } from "./gen-snapshots-list";
import { scrapeTargets } from "./scrape-targets";
import { Snapshot } from "./types";
import { getKeyFromTimeStamp, onlyFeature, safeSplit, safeTrim } from "./utils";
import axios from "axios";
// TODO: final merged sheet - remove multiple appearances of same video on same day. take eariliest snapshot
// TODO: find replace more less
// fix tranredd issue in featured 6
const targets: { [key: string]: Snapshot } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, filePaths.outputs.snapshots), {
    encoding: "utf8",
    flag: "r",
  })
);

const mutableTargets: { [key: string]: Snapshot } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, filePaths.outputs.snapshots), {
    encoding: "utf8",
    flag: "r",
  })
);

const onTargetScraped = async (snapshot: Snapshot) => {
  // mutableTargets[getKeyFromTimeStamp(snapshot.timestamp)] = snapshot;

  try {
    console.log(`////////// STARTING save data request for ${snapshot.timestamp} //////////`);
    await axios.put("http://localhost:3000/api/video-scrape-instances", snapshot.featuredVideos);
    console.log(`////////// COMPLETED save data request for ${snapshot.timestamp} //////////`);
  } catch (e) {
    console.log(`////////// COMPLETED save data request for ${snapshot.timestamp} - ERROR //////////`);
    console.log(snapshot);
  }
  // fs.writeFileSync(
  //   path.resolve(__dirname, filePaths.outputs.snapshots),
  //   JSON.stringify(mutableTargets)
  // );
  // fs.writeFileSync(
  //   path.resolve(__dirname, filePaths.outputs.snapshotsArray),
  //   JSON.stringify(
  //     Object.values(mutableTargets)
  //       .map((el: Snapshot) => el.featuredVideos)
  //       .flat()
  //       .filter((el) => el)
  //   )
  // );
};

const init = async () => {
  genSnapshotsList();
  scrapeTargets(Object.values(targets), onTargetScraped);
};

init();

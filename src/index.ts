import fs from "fs";
import path from "path";
import { filePaths } from "./constants";
import { genSnapshotsList } from "./gen-snapshots-list";
import { scrapeTargets } from "./scrape-targets";
import { Snapshot } from "./types";
import { getKeyFromTimeStamp, safeSplit, safeTrim } from "./utils";

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

const onTargetScraped = (snapshot: Snapshot) => {
  mutableTargets[getKeyFromTimeStamp(snapshot.timestamp)] = snapshot;
  fs.writeFileSync(
    path.resolve(__dirname, filePaths.outputs.snapshots),
    JSON.stringify(mutableTargets)
  );
  fs.writeFileSync(
    path.resolve(__dirname, filePaths.outputs.snapshotsArray),
    JSON.stringify(
      Object.values(mutableTargets)
        .map((el: Snapshot) => el.featuredVideos)
        .flat()
        .filter((el) => el)
    )
  );
};

const init = async () => {
  // genSnapshotsList();

  // scrapeTargets(Object.values(targets), onTargetScraped);

  // "jet\n\t\t\t\t\t\t\t\t\tChannels // Autos & Vehicles",
  const cleaned = Object.keys(targets).reduce((acc, key) => {
    const cv = targets[key];
    acc[key] = {
      ...cv,
      featuredVideos: cv.featuredVideos?.map((vid) => {
        const uploadDate = vid.uploadDate;
        const categoryTag = vid.tags.find((el) => el.includes("Channels //"));
        console.log({ tags: vid.tags, categoryTag });
        return {
          ...vid,
          tags: vid.tags.map((el) => safeTrim(el.split("Channels //")[0])),
          categories: safeSplit(safeSplit(categoryTag, "Channels //")?.[1], ":")
            .map((el) => safeTrim(el))
            .filter((el) => el),
        };
      }),
    };
    return acc;
  }, {} as { [key: string]: Snapshot });

  fs.writeFileSync(
    path.resolve(__dirname, filePaths.outputs.snapshots),
    JSON.stringify(cleaned)
  );
  fs.writeFileSync(
    path.resolve(__dirname, filePaths.outputs.snapshotsArray),
    JSON.stringify(
      Object.values(cleaned)
        .map((el: Snapshot) => el.featuredVideos)
        .flat()
        .filter((el) => el)
    )
  );

  // TODO: now remove slice
  // scrapeTargets(
  //   Object.values(targets).slice(0, 1) as Snapshot[],
  //   onTargetScraped
  // );
};

init();

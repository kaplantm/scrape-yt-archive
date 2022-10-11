import fs from "fs";
import path from "path";
import { filePaths } from "./constants";
import { genSnapshotsList } from "./gen-snapshots-list";
import { scrapeTargets } from "./scrape-targets";
import { Snapshot } from "./types";

const init = () => {
  // genSnapshotsList();

  const targets = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, filePaths.outputs.snapshots), {
      encoding: "utf8",
      flag: "r",
    })
  );

  // scrapeTargets(snapshots);

  // TODO: now remove slice
  scrapeTargets(Object.values(targets).slice(0, 1) as Snapshot[]);
};

init();

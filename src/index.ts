import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import { genSnapshotsList } from "./gen-snapshots-list";
import { filePaths } from "./constants";
import { scrapeTargets } from "./scrape-targets";

const init = () => {
  genSnapshotsList();

  // const snapshotList = JSON.parse(
  //   fs.readFileSync(path.resolve(__dirname, filePaths.outputs.snapshotList), {
  //     encoding: "utf8",
  //     flag: "r",
  //   })
  // );

  // scrapeTargets(snapshotList);
};

init();

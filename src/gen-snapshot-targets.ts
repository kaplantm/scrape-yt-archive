import fs from "fs";
import path from "path";
import { CheckedStatus, Snapshot } from "./types";
import { findEraForTimestamp } from "./utils";

const getValidUniqueSnapshots = (
  rawSnapshotList: string,
  prevGenSnapshotTargets: { [key: string]: Snapshot }
) => {
  return rawSnapshotList
    .split("\n")
    .map((el) => el.split(" "))
    .reduce((acc, el) => {
      // if is valid snapshot
      if (el[4] === "200" && el[3] === "text/html") {
        const key = el[1].substring(0, el[1].length - 4);
        const timestamp = parseInt(key, 10);
        const era = findEraForTimestamp(timestamp);
        // if is unique snapshot (max one snapshot per hour) and within a target era
        if (!acc[key] && era) {
          acc[key] = {
            timestamp,
            checked: CheckedStatus.NOT_ATTEMPTED,
            scraper: era.scraper,
          };
        }
      }
      return acc;
    }, prevGenSnapshotTargets || ({} as { [key: string]: Snapshot }));
};

export const genSnapshotTargets = () => {
  console.log("Starting genSnapshotTargets");
  const rawSnapshotList = fs.readFileSync(
    path.resolve(__dirname, "../inputs/raw-snapshot-list.txt"),
    {
      encoding: "utf8",
      flag: "r",
    }
  );
  const prevGenSnapshotTargets = fs.readFileSync(
    path.resolve(__dirname, "../outputs/snapshot-list.json"),
    {
      encoding: "utf8",
      flag: "r",
    }
  );
  const validUniqueSnapshots = getValidUniqueSnapshots(
    rawSnapshotList,
    JSON.parse(prevGenSnapshotTargets)
  );
  fs.writeFileSync(
    "./outputs/snapshot-list.json",
    JSON.stringify(validUniqueSnapshots)
  );
  console.log("Finished genSnapshotTargets");
};

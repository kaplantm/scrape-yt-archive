import fs from "fs";
import path from "path";
import { filePaths } from "./constants";
import { CheckedStatus, RawSnapshotArray, Snapshot } from "./types";
import { findEraForTimestamp } from "./utils";

const getValidUniqueSnapshots = (
  rawSnapshotList: string,
  prevGenSnapshotTargets: { [key: string]: Snapshot }
) => {
  return (
    rawSnapshotList.split("\n").map((el) => el.split(" ")) as RawSnapshotArray[]
  ).reduce((acc, el) => {
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

export const genSnapshotsList = () => {
  console.log("Starting genSnapshotTargets");
  const rawSnapshots = fs.readFileSync(
    path.resolve(__dirname, filePaths.inputs.rawSnapshots),
    {
      encoding: "utf8",
      flag: "r",
    }
  );

  const outputPath = path.resolve(__dirname, filePaths.outputs.snapshots);
  const prevGenSnapshotTargets = fs.readFileSync(outputPath, {
    encoding: "utf8",
    flag: "r",
  });
  const validUniqueSnapshots = getValidUniqueSnapshots(
    rawSnapshots,
    JSON.parse(prevGenSnapshotTargets)
  );
  fs.writeFileSync(outputPath, JSON.stringify(validUniqueSnapshots));
  console.log("Finished genSnapshotTargets");
};

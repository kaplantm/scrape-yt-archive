import fs from "fs";
import path from "path";
import { filePaths } from "./constants";
import { CheckedStatus, RawSnapshotArray, Snapshot } from "./types";
import { findEraForTimestamp, getKeyFromTimeStamp, onlyFeature } from "./utils";

const getValidUniqueSnapshots = (
  rawSnapshotList: string,
  prevGenSnapshotTargets: { [key: string]: Snapshot }
) => {
  return (
    rawSnapshotList.split("\n").map((el) => el.split(" ")) as RawSnapshotArray[]
  ).reduce((acc, el) => {
    // if is valid snapshot
    if (el[4] === "200" && el[3] === "text/html") {
      const key = getKeyFromTimeStamp(el[1]);
      const era = findEraForTimestamp(parseInt(key, 10));
      // if is unique snapshot (max one snapshot per hour) and within a target era
      if (!acc[key] && era) {
        if (onlyFeature ? era && era.name === onlyFeature : era) {
          acc[key] = {
            timestamp: el[1],
            checked: CheckedStatus.NOT_ATTEMPTED,
            eraName: era.name,
          };
        }
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

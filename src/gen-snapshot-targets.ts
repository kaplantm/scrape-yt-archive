import fs from "fs";
import path from "path";
import { checkedStatus } from "./types";

const getValidUniqueSnapshots = (rawSnapshotList: string) => {
  return rawSnapshotList
    .split("\n")
    .map((el) => el.split(" "))
    .reduce((acc, el) => {
      // if is valid snapshot
      if (el[4] === "200" && el[3] === "text/html") {
        const key = el[1].substring(0, el[1].length - 4);
        // if is unique snapshot (max one snapshot per hour)
        if (!acc[key]) {
          acc[key] = {
            timestamp: parseInt(key, 10),
            checked: checkedStatus.NOT_ATTEMPTED,
          };
        }
      }
      return acc;
    }, {} as { [key: string]: { checked: checkedStatus.NOT_ATTEMPTED; timestamp: number } });
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
  const validUniqueSnapshots = getValidUniqueSnapshots(rawSnapshotList);
  fs.writeFileSync(
    "./outputs/snapshot-list",
    JSON.stringify(validUniqueSnapshots)
  );
  console.log("Finished genSnapshotTargets");
};

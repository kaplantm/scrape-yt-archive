import axios from "axios";
import cheerio from "cheerio";
import { genSnapshotTargets } from "./gen-snapshot-targets";

// features started: jun 14th 2005 20050614234128
// features ended: dec 1 2011 20111201003233
// from youtube started: dec 2 2011 20111202112857
// from youtube ended: dec 4 2012 20121204000356
const getScraper = (timestamp: number) => {
  if (timestamp >= 2005061423 && timestamp <= 2011120100) {
    // features scaper
    return null;
  } else if (timestamp >= 2011120211 && timestamp <= 2012120400) {
    // from youtube scaper
    return null;
  }
  return null;
};

const init = () => {
  genSnapshotTargets();
};

init();

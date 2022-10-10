import { Era, Scraper } from "./types";

// features started: jun 14th 2005 20050614234128
// features ended: dec 1 2011 20111201003233
// from youtube started: dec 2 2011 20111202112857
// from youtube ended: dec 4 2012 20121204000356
export const eras: Era[] = [
  {
    name: "first-featured",
    start: 2005061423,
    end: 2011120100,
    scraper: Scraper.FEATURED_1,
  },
  // { name: "from-youtube", start: 2011120211, end: 2012120400, scraper: null },
];

export const scraperMap = {
  [Scraper.FEATURED_1]: undefined,
};

export const filePaths = {
  outputs: {
    snapshots: "../outputs/snapshots.json",
  },
  inputs: {
    rawSnapshots: "../inputs/raw-snapshots.txt",
  },
};

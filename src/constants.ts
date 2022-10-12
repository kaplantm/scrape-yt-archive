import { featuredOneScraper } from "./scrapers/featured-one";
import { featuredThreeScraper } from "./scrapers/featured-three";
import { featuredTwoScraper } from "./scrapers/featured-two";
import { featuredFourScraper } from "./scrapers/featured-four";
import { Era, eraName } from "./types";
import { getEraBoundFromTimeStamp } from "./utils";

// featured 1 ("Featured Videos" horizontal)
//   start: jun 14th 2005 20050614234128
//   ended: july 18th 2005 20050718235237
// featured 2 ("Today's Featured Videos") (moduleEntry)
//   start: jun 20th 2005 20050720021800
//   ended: april 28th 2005 20060428025149
// featured 3 ("Today's Featured Videos") (visually the same, code different) (contentListBox)
//   start: may 2nd 2006 20060502203540
//   ended: june 22nd 2006 20060622215407
// featured 4 ("Featured Videos") (vListBox)
//   start: july 1 2006 20060701022704
//   ended: jan 3 2007 20070103134232
// featured 5 ("Featured Videos") (white header bg) (hpFeaturedList)
//   start: jan 4 2007 20070104102404
//   ended:
// featured 6 ("Featured Videos") (white header bg) (hpVideoList)
//   start:
//   ended:
// MORE TBD
// some versions have selected by https://web.archive.org/web/20071101014538/http://www.youtube.com/
// from youtube
//   start: dec 2 2011 20111202112857
//   ended: dec 4 2012 20121204000356

// https://web.archive.org/web/20060605013018/http://www.youtube.com/ - new style
export const eras: Partial<{ [key in eraName]: Era }> = {
  // [eraName.FEATURED_1]: {
  //   // ("Featured Videos" horizontal)
  //   name: eraName.FEATURED_1,
  //   start: getEraBoundFromTimeStamp("20050614234128"), // jun 14th 2005
  //   end: getEraBoundFromTimeStamp("20050718235237"), // july 18th 2005
  //   scraper: featuredOneScraper,
  // },
  // [eraName.FEATURED_2]: {
  //   // ("Today's Featured Videos") (moduleEntry)
  //   name: eraName.FEATURED_2,
  //   start: getEraBoundFromTimeStamp("20050720021800"), // jun 20th 2005
  //   end: getEraBoundFromTimeStamp("20060428025149"), // april 28th 2005
  //   scraper: featuredTwoScraper,
  // },
  // [eraName.FEATURED_3]: {
  //   // ("Today's Featured Videos") (contentListBox)
  //   name: eraName.FEATURED_3,
  //   start: getEraBoundFromTimeStamp("20060502203540"), // may 2nd 2006
  //   end: getEraBoundFromTimeStamp("20060622215407"), // june 22nd 2006
  //   scraper: featuredThreeScraper,
  // },
  [eraName.FEATURED_4]: {
    // ("Today's Featured Videos") (contentListBox)
    name: eraName.FEATURED_4,
    start: getEraBoundFromTimeStamp("20060701022704"), // july 1 2006
    end: getEraBoundFromTimeStamp("20070103134232"), // jan 3 2007
    scraper: featuredFourScraper,
  },
  // { name: "from-youtube", start: 2011120211, end: 2012120400, scraper: null },
};
export const erasArray = Object.values(eras);

export const filePaths = {
  outputs: {
    snapshots: "../outputs/snapshots.json",
    snapshotsArray: "../outputs/snapshotsArray.json",
  },
  inputs: {
    rawSnapshots: "../inputs/raw-snapshots.txt",
  },
};

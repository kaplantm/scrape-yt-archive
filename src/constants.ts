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
// featured 5 ("Featured Videos") (white header bg) (hpFeaturedList - vEntry)
//   start: jan 4 2007 20070104102404
//   ended: april 9 2008 20080409051340
// has selected by toolbar sometimes https://web.archive.org/web/20071101014538/http://www.youtube.com/
// featured 6 ("Featured Videos") (white header bg) (hpVideoList - vlentry)
// note: how view count and some of the other facets are handled changes https://web.archive.org/web/20081202020914/http://www.youtube.com/
//   start: april 10 2008 20080410125312
//   ended: march 25 2009 20090325031018
// sometimes has selected by https://web.archive.org/web/20080416001656/http://www.youtube.com/
// featured 7 ("Featured Videos") (grid view)
//   start: march 26 2009 20090326040603
//   ended: april 22 2009 20090422013412
// featured 8 ("Featured Videos") (blue header bg)
//   start: april 23 2009 20090423001139
//   ended: oct 6 2010 20101006012045
// featured 9 sidebar!
//   start: oct 7 2010 20101007011142
//   ended: dec 1 2011 20111201005550

// https://web.archive.org/web/20060605013018/http://www.youtube.com/ - new style
export const eras: Partial<{ [key in eraName]: Era }> = {
  [eraName.FEATURED_1]: {
    // ("Featured Videos" horizontal)
    name: eraName.FEATURED_1,
    start: getEraBoundFromTimeStamp("20050614234128"), // jun 14th 2005
    end: getEraBoundFromTimeStamp("20050718235237"), // july 18th 2005
    scraper: featuredOneScraper,
  },
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
  // [eraName.FEATURED_4]: {
  //   // ("Today's Featured Videos") (contentListBox)
  //   name: eraName.FEATURED_4,
  //   start: getEraBoundFromTimeStamp("20060701022704"), // july 1 2006
  //   end: getEraBoundFromTimeStamp("20070103134232"), // jan 3 2007
  //   scraper: featuredFourScraper,
  // },
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

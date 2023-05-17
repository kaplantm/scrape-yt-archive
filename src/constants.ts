import { featuredOneScraper } from "./scrapers/featured-one";
import { featuredThreeScraper } from "./scrapers/featured-three";
import { featuredTwoScraper } from "./scrapers/featured-two";
import { featuredFourScraper } from "./scrapers/featured-four";
import { Era, eraName } from "./types";
import { getEraBoundFromTimeStamp } from "./utils";
import { featuredFiveScraper } from "./scrapers/featured-five";
import { featuredSixScraper } from "./scrapers/featured-six";
import { featuredSevenScraper } from "./scrapers/featured-seven";
import { featuredEightScraper } from "./scrapers/featured-eight";
import { featuredNineScraper } from "./scrapers/featured-nine";

export const eras: { [key in eraName]: Era } = {
  [eraName.FEATURED_1]: {
    // ("Featured Videos" horizontal)
    name: eraName.FEATURED_1,
    start: getEraBoundFromTimeStamp("20050614234128"), // jun 14th 2005
    end: getEraBoundFromTimeStamp("20050718235237"), // july 18th 2005
    scraper: featuredOneScraper,
  },
  [eraName.FEATURED_2]: {
    // ("Today's Featured Videos") (moduleEntry)
    name: eraName.FEATURED_2,
    start: getEraBoundFromTimeStamp("20050720021800"), // jun 20th 2005
    end: getEraBoundFromTimeStamp("20060428025149"), // april 28th 2006
    scraper: featuredTwoScraper,
  },
  [eraName.FEATURED_3]: {
    // ("Today's Featured Videos") (contentListBox)
    name: eraName.FEATURED_3,
    start: getEraBoundFromTimeStamp("20060502203540"), // may 2nd 2006
    end: getEraBoundFromTimeStamp("20060622215407"), // june 22nd 2006
    scraper: featuredThreeScraper,
  },
  [eraName.FEATURED_4]: {
    // ("Today's Featured Videos") (contentListBox)
    name: eraName.FEATURED_4,
    start: getEraBoundFromTimeStamp("20060701022704"), // july 1 2006
    end: getEraBoundFromTimeStamp("20070103134232"), // jan 3 2007
    scraper: featuredFourScraper,
  },
  [eraName.FEATURED_5]: {
    // ("Featured Videos") (white header bg) (hpFeaturedList - vEntry)
    name: eraName.FEATURED_5,
    start: getEraBoundFromTimeStamp("20070104102404"), // jan 4 2007
    end: getEraBoundFromTimeStamp("20080409051340"), // april 9 2008
    scraper: featuredFiveScraper,
  },
  [eraName.FEATURED_6]: {
    // ("Featured Videos") (white header bg) (hpVideoList - vlentry)
    name: eraName.FEATURED_6,
    start: getEraBoundFromTimeStamp("20080410125312"), // april 10 2008
    end: getEraBoundFromTimeStamp("20081204015218"), // dec 4 2008
    scraper: featuredSixScraper,
  },
  [eraName.FEATURED_7]: {
    // ("Featured Videos") (home page list)
    name: eraName.FEATURED_7,
    start: getEraBoundFromTimeStamp("20081204130433"), // december 4 2008
    end: getEraBoundFromTimeStamp("20090325031018"), // march 25 2009
    scraper: featuredSevenScraper,
  },
  [eraName.FEATURED_8]: {
    // ("Featured Videos") (grid view)
    name: eraName.FEATURED_8,
    start: getEraBoundFromTimeStamp("20090326040603"), // march 26 2009
    end: getEraBoundFromTimeStamp("20090422013412"), // april 22 2009
    scraper: featuredEightScraper, 
  },
  [eraName.FEATURED_9]: {
    // ("Featured Videos") (blue header bg and no blue bg)
    // get a sidebar sept 30 2010 (20100930234605)
    name: eraName.FEATURED_9,
    start: getEraBoundFromTimeStamp("20090326040603"), // march 26 2009
    end: getEraBoundFromTimeStamp("20111201003233"), // dec 1 2011
    scraper: featuredNineScraper,
  },
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

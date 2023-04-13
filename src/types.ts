import { CheerioAPI } from "cheerio";

export enum CheckedStatus {
  FOUND = "FOUND",
  FAILED = "FAILED",
  NOT_ATTEMPTED = "NOT_ATTEMPTED",
}

export enum eraName {
  FEATURED_1 = "FEATURED_1",
  FEATURED_2 = "FEATURED_2",
  FEATURED_3 = "FEATURED_3",
  FEATURED_4 = "FEATURED_4",
  FEATURED_5 = "FEATURED_5",
  FEATURED_6 = "FEATURED_6",
  FEATURED_7 = "FEATURED_7",
  FEATURED_8 = "FEATURED_8",
  FEATURED_9 = "FEATURED_9",
}

export type Era = {
  name: eraName;
  start: number;
  end: number;
  scraper: ($: CheerioAPI, snapshot: Snapshot) => FeaturedVideo[];
};

export type Snapshot = {
  checked: CheckedStatus;
  timestamp: string;
  eraName: eraName;
  featuredVideos?: FeaturedVideo[];
};

export type RawSnapshotArray = [
  urlkey: string,
  timestamp: string,
  original: string,
  mimetype: string,
  statuscode: string,
  digest: string,
  length: string
];

export type Video = {
  title: string;
  views: number | undefined;
  description: string;
  author: string;
  videoId: string;
  uploadDate: string | undefined;
  comments: number | undefined;
  tags: string[];
  categories: string[];
  duration: number | undefined;
  age: string | undefined;
  stars: number | undefined;
  numRatings: number | undefined;
};

export type FeaturedVideo = Video & {
  dateFeatured: string;
  dateFeaturedEpoch: number;
  timestampFeatured: string;
  selectedBy: string | undefined;
  selectedByLink: string | undefined;
};

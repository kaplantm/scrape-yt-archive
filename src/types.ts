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
  views: number | null;
  description: string;
  author: string;
  videoId: string;
  uploadDate: string | null;
  comments: number | null;
  tags: string[];
  categories: string[];
  duration: number | null;
  age: string | null;
  stars: number | null;
  numRatings: number | null;
};

export type FeaturedVideo = Video & {
  dateFeatured: string;
  dateFeaturedEpoch: number;
  timestampFeatured: string;
  selectedBy: string | null;
  selectedByLink: string | null;
};

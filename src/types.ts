import { CheerioAPI } from "cheerio";

export enum CheckedStatus {
  FOUND = "FOUND",
  FAILED = "FAILED",
  NOT_ATTEMPTED = "NOT_ATTEMPTED",
}

export enum eraName {
  FEATURED_1 = "FEATURED_1",
}

export type Era = {
  name: eraName;
  start: number;
  end: number;
  scraper: ($: CheerioAPI, snapshot: Snapshot) => FeaturedVideo[];
};

export type Snapshot = {
  checked: CheckedStatus.NOT_ATTEMPTED;
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
  views: number;
  author: string;
  videoId: string;
  uploadDate?: string;
  comments?: number;
};

export type FeaturedVideo = Video & {
  dateFeatured: string;
  dateFeaturedEpoch: number;
  timestampFeatured: string;
};

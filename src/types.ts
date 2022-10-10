export enum CheckedStatus {
  FOUND = "FOUND",
  FAILED = "FAILED",
  NOT_ATTEMPTED = "NOT_ATTEMPTED",
}

export enum EraName {
  FEATURED_1 = "FEATURED_1",
}

export type Era = {
  name: EraName;
  start: number;
  end: number;
  scraper: () => void;
};

export type Snapshot = {
  checked: CheckedStatus.NOT_ATTEMPTED;
  timestamp: string;
  EraName: EraName;
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
  thumbnail: string;
  url: string;
  uploadDate?: string;
  comments?: number;
};

export type FeaturedVideo = Video & {
  dateFeatured: string;
  dateFeaturedEpoch: string;
  timestampFeatured: string;
};

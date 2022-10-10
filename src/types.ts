export enum CheckedStatus {
  FOUND = "FOUND",
  NOT_FOUND = "FAILED",
  NOT_ATTEMPTED = "NOT_ATTEMPTED",
}

export enum Scraper {
  FEATURED_1 = "FEATURED_1",
}

export type Era = {
  name: string;
  start: number;
  end: number;
  scraper: Scraper;
};

export type Snapshot = {
  checked: CheckedStatus.NOT_ATTEMPTED;
  timestamp: number;
  scraper: string;
  data?: string;
};

import { VideoScrapeInstance, Video, FeatureDate, User } from "@prisma/client";

export type VideoScrapeInstanceWithInclusions =
  | (VideoScrapeInstance & {
      Video: Video;
      FeatureDate: FeatureDate;
      Selector: User | null;
    })
  | null;

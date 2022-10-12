import fs from "fs";
import path from "path";

export const mockYoutubeFeatured1 = fs.readFileSync(
  path.resolve(__dirname, "../youtube/featured-1.html"),
  {
    encoding: "utf8",
    flag: "r",
  }
);

export const mockYoutubeFeatured2 = fs.readFileSync(
  path.resolve(__dirname, "../youtube/featured-2.html"),
  {
    encoding: "utf8",
    flag: "r",
  }
);

export const mockYoutubeFeatured3 = fs.readFileSync(
  path.resolve(__dirname, "../youtube/featured-3.html"),
  {
    encoding: "utf8",
    flag: "r",
  }
);

import { eraName } from "../../types";
import { readFile } from "../../utils";

export const featureMocks = {
  [eraName.FEATURED_1]: readFile("./mocks/youtube/featured-1.html"),
  [eraName.FEATURED_2]: readFile("./mocks/youtube/featured-2.html"),
  [eraName.FEATURED_3]: readFile("./mocks/youtube/featured-3.html"),
  [eraName.FEATURED_4]: readFile("./mocks/youtube/featured-4.html"),
  [eraName.FEATURED_5]: readFile("./mocks/youtube/featured-5.html"),
  [eraName.FEATURED_6]: readFile("./mocks/youtube/featured-6.html"),
  [eraName.FEATURED_7]: readFile("./mocks/youtube/featured-7.html"),
  [eraName.FEATURED_8]: readFile("./mocks/youtube/featured-5.html"), // TODO
  [eraName.FEATURED_9]: readFile("./mocks/youtube/featured-5.html"), // TODO
};

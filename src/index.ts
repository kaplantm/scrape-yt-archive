import axios from "axios";
import cheerio from "cheerio";
import { genSnapshotTargets } from "./gen-snapshot-targets";

const init = () => {
  genSnapshotTargets();
};

init();

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as videoService from "../../services/api/video-scrape-instance";
import { ApiResponse } from "services/types";

type VideoScrapeInstancesResponse = ApiResponse<
  Awaited<ReturnType<typeof videoService.upsertVideoScrapInstance>>
>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideoScrapeInstancesResponse["data"]>
) {
  switch (req.method) {
    case "PUT":
      res
        .status(200)
        .json(await videoService.upsertVideoScrapInstance(req.body));
      return;
  }

  res.status(405).json({ error: "Unsupported Method" });
}

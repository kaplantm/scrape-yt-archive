// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as videoService from "../../services/api/video-scrape-instance";
type VideoScrapeInstancesResponse = Awaited<ReturnType<typeof videoService.upsertVideoScrapInstance>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<VideoScrapeInstancesResponse["data"]>) {
  let result;
  switch (req.method) {
    case "PUT":
      result = await videoService.upsertVideoScrapInstance(req.body);
      res.status(result.status).json(result.data);
      return;

    case "GET":
      result = await videoService.getVideoScrapeInstances(req.query);

      res.status(result.status).json(result.data);
      return;
  }

  res.status(405).json({ error: "Unsupported Method" });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import * as videoService from "../../services/api/video-service";
import { ApiResponse } from "@/services/types";
import { Video } from "@prisma/client";

type VideoResponse = ApiResponse<Video | Video[] | Prisma.BatchPayload>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideoResponse["data"]>
) {
  let response: ApiResponse<Video | Video[] | Prisma.BatchPayload> = {
    status: 405,
    data: { error: "Unsupported Method" },
  };
  switch (req.method) {
    case "POST":
      response = await videoService.createVideos(req.body);
      break;
  }

  res.status(response.status).json(response.data);
}

import YearPageContainer from "@/page_containers/year";
import { getFirstVideoScrapeInstance } from "@/services/prisma/video-scrape-instance";
import { getRange } from "@/utils/num-utils";
import { PrismaClient, Video, VideoScrapeInstance } from "@prisma/client";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { ComponentProps } from "react";

type PParams = {
  year: string;
};

type AgQueryType<T extends string> = Partial<{ [key in T]: true }>;

export const getStaticPaths: GetStaticPaths<PParams> = () => {
  const years = getRange(2005, new Date().getFullYear());
  return {
    paths: years.map((year) => ({ params: { year: year.toString() } })),
    fallback: false,
  };
};

const prisma = new PrismaClient();
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const year = parseInt((params as PParams).year);
  const where = {
    FeatureDate: {
      epoch_date: {
        gte: new Date(`${year}-01-01T00:00:00`).getTime(),
        lt: new Date(`${year + 1}-01-01T00:00:00`).getTime(),
      },
    },
  };

  const featureInstances = await prisma.videoScrapeInstance.aggregate({
    _avg: {
      ratings: true,
      stars: true,
      comments: true,
    },
    where,
  });

  const topVideos = {
    mostViewedVideo: await getFirstVideoScrapeInstance(prisma),
    leastViewedVideo: await getFirstVideoScrapeInstance(prisma, "views", "asc"),
    mostRatedVideo: await getFirstVideoScrapeInstance(prisma, "ratings"),
    leastRatedVideo: await getFirstVideoScrapeInstance(
      prisma,
      "ratings",
      "asc"
    ),
    topRatedVideo: await getFirstVideoScrapeInstance(prisma, "stars"),
    bottomRatedVideo: await getFirstVideoScrapeInstance(prisma, "stars", "asc"),
    mostDiscussed: await getFirstVideoScrapeInstance(prisma, "comments"),
    leastDiscussed: await getFirstVideoScrapeInstance(
      prisma,
      "comments",
      "asc"
    ),
  };

  return {
    props: {
      topVideos,
    },
  };
};

const YearPage = (props: ComponentProps<typeof YearPageContainer>) => (
  <YearPageContainer {...props} />
);

export default YearPage;

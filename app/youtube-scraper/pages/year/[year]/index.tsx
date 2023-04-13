import { getRange } from "@/utils/num-utils";
import { FeatureInstance, PrismaClient, Video } from "@prisma/client";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";

type PParams = {
  year: string;
};

type AgQueryType<T> = Partial<{ [key in T]: true }>;

export const getStaticPaths: GetStaticPaths<PParams> = () => {
  const years = getRange(2005, new Date().getFullYear());
  return {
    paths: years.map((year) => ({ params: { year: year.toString() } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ data: any }, PParams> = async ({
  params,
}) => {
  const year = parseInt((params as PParams).year);
  const prisma = new PrismaClient();
  const where = {
    FeatureDate: {
      epoch_date: {
        gte: new Date(`${year}-01-01T00:00:00`).getTime(),
        lt: new Date(`${year + 1}-01-01T00:00:00`).getTime(),
      },
    },
  };
  const instanceKeys: AgQueryType<keyof FeatureInstance> = {
    views: true,
    ratings: true,
    stars: true,
    comments: true,
  };

  const featureInstances = await prisma.featureInstance.aggregate({
    _avg: instanceKeys,
    _count: { id: true },
    _max: instanceKeys,
    _min: instanceKeys,
    _sum: instanceKeys,
    where,
  });

  const videoKeys: AgQueryType<keyof Video> = {
    duration: true,
  };

  const videos = await prisma.video.aggregate({
    _avg: videoKeys,
    _count: { id: true },
    _max: videoKeys,
    _min: videoKeys,
    _sum: videoKeys,
    where,
  });

  return {
    props: {
      agg: { featureInstances, videos },
    },
  };
};

const YearPage = ({ agg }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { year } = router.query as PParams;

  return (
    <div>
      <header>{year}</header>
      <pre>{JSON.stringify(agg, null, 2)}</pre>
    </div>
  );
};

export default YearPage;

20050614234128;
20060000000000;

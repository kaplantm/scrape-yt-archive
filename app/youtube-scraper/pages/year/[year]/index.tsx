import SummaryPageContainer from "components/page_containers/summary";
import {
  SummaryPageParams,
  generatePageStaticPaths,
  generatePageStaticProps,
} from "components/page_containers/summary/helpers/page-generation";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React, { ComponentProps } from "react";
import { easyEpochDate } from "utils/time-utils";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: generatePageStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async (
  props: GetStaticPropsContext
) => {
  // TODO: now move?
  const paramYear = parseInt((props.params as SummaryPageParams)?.year);
  const paramsMonth = (props.params as SummaryPageParams)?.month;
  const month = paramsMonth ? parseInt(paramsMonth) : undefined;
  const year = paramYear || 2005;
  const start = easyEpochDate(year, month);
  const end = easyEpochDate((paramYear || new Date().getFullYear()) + 1);

  return {
    props: await generatePageStaticProps({ start, end }),
  };
};

const YearPage = (props: ComponentProps<typeof SummaryPageContainer>) => {
  console.log({ props });
  return <SummaryPageContainer {...props} />;
};

export default YearPage;

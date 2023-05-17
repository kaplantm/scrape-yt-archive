import MonthPageContainer from "components/page_containers/month";
import {
  SummaryPageParams,
  generatePageStaticPaths,
} from "components/page_containers/month/helpers/page-generation";
import { generatePageStaticProps } from "components/page_containers/summary/helpers/page-generation";
import SummaryPageContainer from "components/page_containers/summary";
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
  const month = paramsMonth ? parseInt(paramsMonth)-1 : undefined;
  const year = paramYear || 2005;
  const start = easyEpochDate(year, month);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const end = easyEpochDate(year, month! + 1);

  console.log("<<<<<<<<", { start, end });
  return {
    props: await generatePageStaticProps(props, { start, end }),
  };
};
const MonthPage = (props: ComponentProps<typeof SummaryPageContainer>) => {
  console.log(props);
  // return <p>foo</p>;
  // return <MonthPageContainer {...props} />;
  return <SummaryPageContainer {...props} />;
};

export default MonthPage;

import SummaryPageContainer from "components/page_containers/summary";
import {
  generatePageStaticPaths,
  generatePageStaticProps,
} from "components/page_containers/summary/helpers/page-generation";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React, { ComponentProps } from "react";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: generatePageStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async (
  props: GetStaticPropsContext
) => ({
  props: await generatePageStaticProps(props),
});

const YearPage = (props: ComponentProps<typeof SummaryPageContainer>) => {
  console.log({ props });
  return <SummaryPageContainer {...props} />;
};

export default YearPage;

import MonthPageContainer from "components/page_containers/month";
import {
  generatePageStaticPaths,
  generatePageStaticProps,
} from "components/page_containers/month/helpers/page-generation";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React, { ComponentProps } from "react";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: generatePageStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async (props: GetStaticPropsContext) => ({
  props: await generatePageStaticProps(props),
});

const MonthPage = (props: ComponentProps<typeof SummaryPageContainer>) => {
  console.log(props);
  return <p>foo</p>;
  // return <MonthPageContainer {...props} />;
};

export default MonthPage;

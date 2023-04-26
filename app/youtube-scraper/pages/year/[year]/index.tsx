import YearPageContainer from "components/page_containers/year";
import {
  generatePageStaticPaths,
  generatePageStaticProps,
} from "components/page_containers/year/helpers/page-generation";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React, { ComponentProps } from "react";

export const getStaticPaths: GetStaticPaths = () => ({
  paths: generatePageStaticPaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async (props: GetStaticPropsContext) => ({
  props: await generatePageStaticProps(props),
});

const YearPage = (props: ComponentProps<typeof YearPageContainer>) => {
  console.log(props);
  // return <p>foo</p>;
  return <YearPageContainer {...props} />;
};

export default YearPage;

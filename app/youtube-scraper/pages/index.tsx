import SummaryPageContainer from "components/page_containers/summary";
import { generatePageStaticProps } from "components/page_containers/summary/helpers/page-generation";
import { GetStaticProps, GetStaticPropsContext } from "next";
import React, { ComponentProps } from "react";


export const getStaticProps: GetStaticProps = async (props: GetStaticPropsContext) => ({
  props: await generatePageStaticProps(props),
});

const AllTimePage = (props: ComponentProps<typeof SummaryPageContainer>) => {
  return <SummaryPageContainer {...props} />;
};

export default AllTimePage;

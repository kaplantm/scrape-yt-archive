import Nav from "components/Nav";
import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

// TODO: react helmet header
// TODO: nav
const MainLayout = ({ children }: PropsWithChildren) => {
  const { query = {} } = useRouter();
  return (
    <>
      <Head>
        <title>{`${query.month || ""} ${query.year || ""} ${query.year ? "|" : ""} Featured Youtube Videos`}</title>
      </Head>
      <Nav />
      <div className="p-10">{children}</div>
    </>
  );
};

export default MainLayout;

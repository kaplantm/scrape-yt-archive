import Nav from "components/Nav";
import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

const kofiWidgetScript = `<script>
    kofiWidgetOverlay.draw('tonarie', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Support Me',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff'
  })</script>`;

const MainLayout = ({ children }: PropsWithChildren) => {
  const { query = {} } = useRouter();
  return (
    <>
      <Head>
        <title>{`${query.month || ""} ${query.year || ""} ${
          query.year ? "|" : ""
        } Featured Youtube Videos`}</title>
        <script async src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js" />
      </Head>
      <Nav />
      <div className="p-10">{children}</div>
      <div dangerouslySetInnerHTML={{ __html: kofiWidgetScript }} />
    </>
  );
};

export default MainLayout;

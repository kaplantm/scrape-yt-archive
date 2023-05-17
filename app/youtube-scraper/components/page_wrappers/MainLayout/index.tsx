import Nav from "components/Nav";
import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { dateFormatters } from "utils/time-utils";

const kofiWidgetScript = `<script>
if(typeof kofiWidgetOverlay !== 'undefined'){
    kofiWidgetOverlay.draw('tonarie', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Support Project',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff',
  })}</script>`;

const MainLayout = ({ children }: PropsWithChildren) => {
  const { query = {} } = useRouter();
  const { year, month } = query as { year: string; month?: string };
  const date = new Date(Date.UTC(parseInt(year), parseInt(month || "1"), 1));
  const dateFormatter = month
    ? dateFormatters.shortMonthYYYY
    : dateFormatters.YYYY;
  const datePrefix = dateFormatter(date);
  return (
    <>
      <Head>
        <title>{`${year ? datePrefix : ""} Featured Youtube Videos`}</title>
        {/* needed for now or else kofi fails */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js" />
      </Head>
      <Nav />
      <div className="p-10">{children}</div>
      <div dangerouslySetInnerHTML={{ __html: kofiWidgetScript }} />
    </>
  );
};

export default MainLayout;

import Nav from "components/Nav";
import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";

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

  return (
    <>
      <Head>
        <title>{`${query.month || ""} ${query.year || ""} ${
          query.year ? "|" : ""
        } Featured Youtube Videos`}</title>
        {/* needed for now or else kofi fails */}
        <script src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js" />
      </Head>
      <Nav />
      <div className="p-10">{children}</div>
      <div dangerouslySetInnerHTML={{ __html: kofiWidgetScript }} />
    </>
  );
};

export default MainLayout;

import MainLayout from "components/page_wrappers/MainLayout";
import WithDevTools from "components/page_wrappers/WithDevTools";
import DebugContext, { useDebugContextState } from "hooks/contexts/debug";
import "styles/globals.css";
import { isDev } from "utils/env-utils";
import type { AppProps } from "next/app";
import { Fragment, useMemo } from "react";

export default function App({ Component, pageProps, router }: AppProps) {
  const DevDebugProvider = isDev ? DebugContext.Provider : Fragment;
  const DevWrapper = isDev ? WithDevTools : Fragment;
  const debugContextState = useDebugContextState();

  return (
    <DevDebugProvider value={debugContextState}>
      <DevWrapper data={pageProps} path={router.asPath}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </DevWrapper>
    </DevDebugProvider>
  );
}

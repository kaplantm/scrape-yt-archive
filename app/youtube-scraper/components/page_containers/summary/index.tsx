import { useRouter } from "next/router";
import VideoCallout from "components/HighlightedVideo";
import { generatePageStaticProps } from "./helpers/page-generation";
import { Fragment, memo } from "react";

const SummaryPageContainer = (props: Awaited<ReturnType<typeof generatePageStaticProps>>) => {
  const { highlightedFeaturedVideos, mostLeastList, counts, mostFeaturedAuthors } = props;

  const router = useRouter();
  const { year } = router.query;

  return (
    <div>
      <div className="flex gap-10 mb-10">
        <header>
          <h1 className="text-3xl">Featured Videos</h1>
          {/* TODO: now not hardcode, use latest scrape? */}
          <span className="text-9xl font-bold text-red-500">{year || "2005-2023"}</span>
        </header>
        {!!mostLeastList.length && (
          <>
            {mostLeastList.map(
              (el) =>
                !!el.value?.length && (
                  <section className="flex flex-col items-start" key={el.label}>
                    <p className="pb-1">{el.label}:</p>
                    <ul className="flex flex-col gap-1 border-l-red-400 border-l-8 border-t-red-400 border-t-8 pl-2">
                      {el.value.map((val) => (
                        <li key={val.name}>{val.name}</li>
                      ))}
                    </ul>
                  </section>
                )
            )}
            {!!mostFeaturedAuthors?.length && (
              <section className="flex flex-col items-start">
                <p className="pb-1">Top Video Authors:</p>
                <ul className="flex flex-col gap-1 border-l-red-400 border-l-8 border-t-red-400 border-t-8 pl-2">
                  {mostFeaturedAuthors.map((el) => (
                    <li key={el.name}>
                      <a target="_blank" href={`https://www.youtube.com/@${el.name}`}>
                        {el.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <div className="flex flex-col gap-2 items-start">
              {Object.values(counts).map(
                (el) =>
                  !!el?.value && (
                    <p key={el.label}>
                      <span className="text-lg font-bold text-red-400">{parseInt(el.value)}</span> {el.label}
                    </p>
                  )
              )}
            </div>
          </>
        )}
      </div>
      <section>
        <div className="grid grid-cols-4 gap-4">
          {highlightedFeaturedVideos?.map(
            ({ most, least }) =>
              !!(most || least) && (
                <Fragment key={most?.label || least?.label}>
                  {most?.videoScrapeInstance && (
                    <VideoCallout
                      label={most.label}
                      value={most.value}
                      sentiment={most.sentiment}
                      videoScrapeInstance={most.videoScrapeInstance}
                    />
                  )}
                  {least?.videoScrapeInstance && (
                    <VideoCallout
                      label={least.label}
                      value={least.value}
                      sentiment={least.sentiment}
                      videoScrapeInstance={least.videoScrapeInstance}
                    />
                  )}
                </Fragment>
              )
          )}
        </div>
      </section>
    </div>
  );
};

export default memo(SummaryPageContainer);

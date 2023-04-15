import { useRouter } from "next/router";
import VideoCallout from "components/HighlightedVideo";
import { generatePageStaticProps } from "./helpers/page-generation";
import { Fragment, memo } from "react";

type foo = Awaited<ReturnType<typeof generatePageStaticProps>>;
const YearPageContainer = (props: Awaited<ReturnType<typeof generatePageStaticProps>>) => {
  console.log("***** YearPageContainer", props);
  const { highlightedFeaturedVideos } = props;

  const router = useRouter();
  const { year } = router.query;

  return (
    <div className="p-8">
      <header>
        {year}
        <h1>Featured Videos: {year} Year in Review</h1>
      </header>
      <section>
        <div className="grid grid-cols-2 gap-4">
          {highlightedFeaturedVideos.map(({ most, least }) => (
            <Fragment key={most.label}>
              {most.videoScrapeInstance && (
                <VideoCallout
                  label={most.label}
                  value={most.value?.toString()}
                  sentiment={most.sentiment}
                  videoScrapeInstance={most.videoScrapeInstance}
                />
              )}
              {least.videoScrapeInstance && (
                <VideoCallout
                  label={least.label}
                  value={least.label}
                  sentiment={least.sentiment}
                  videoScrapeInstance={least.videoScrapeInstance}
                />
              )}
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default memo(YearPageContainer);

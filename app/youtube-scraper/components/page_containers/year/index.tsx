import { useRouter } from "next/router";
import VideoCallout from "components/HighlightedVideo";
import { generatePageStaticProps } from "./helpers/page-generation";
import { Fragment, memo } from "react";

const YearPageContainer = (props: Awaited<ReturnType<typeof generatePageStaticProps>>) => {
  console.log("***** YearPageContainer", props);
  const { highlightedFeaturedVideos, mostLeastList, counts, mostFeaturedAuthors } = props;

  const router = useRouter();
  const { year } = router.query;

  return (
    <div className="p-8">
      <header>
        {year}
        <h1>Featured Videos: {year} Year in Review</h1>
      </header>
      {!!mostLeastList.length &&
        mostLeastList.map(
          (el) =>
            !!el.value?.length && (
              <section className="flex gap-5" key={el.label}>
                <p>{el.label}:</p>
                <ul className="flex gap-5">
                  {el.value.map((val) => (
                    <li key={val.name}>{val.name}</li>
                  ))}
                </ul>
              </section>
            )
        )}
      {!!mostFeaturedAuthors?.length && (
        <div className="flex gap-5">
          <p>Most Featured Authors</p>
          <ul className="flex gap-5">
            {mostFeaturedAuthors.map((el) => (
              <li key={el.name}>
                <a target="_blank" href={`https://www.youtube.com/@${el.name}`}>
                  {el.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {Object.values(counts).map((el) => !!el?.value && <p key={el.label}>{`${el.value} ${el.label}`}</p>)}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {highlightedFeaturedVideos?.map(({ most, least }) => (
            <Fragment key={most.label}>
              {most?.videoScrapeInstance && (
                <VideoCallout
                  label={most.label}
                  value={most.value?.toString()}
                  sentiment={most.sentiment}
                  videoScrapeInstance={most.videoScrapeInstance}
                />
              )}
              {least?.videoScrapeInstance && (
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

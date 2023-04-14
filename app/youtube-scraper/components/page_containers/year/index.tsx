import { getFirstVideoScrapeInstance } from "@/services/prisma/video-scrape-instance";
import { VideoScrapeInstanceWithInclusions } from "@/types/prisma-extended";
import { Nullable } from "@/types/utility-types";
import clsx from "clsx";
import { useRouter } from "next/router";
import styles from "./index.module.scss"

type YearPageProps = {
  topVideos: {
    mostViewedVideo: Awaited<
      Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>
    >;
    leastViewedVideo: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
    mostRatedVideo: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
    leastRatedVideo: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
    topRatedVideo: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
    bottomRatedVideo: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
    mostDiscussed: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
    leastDiscussed: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
  };
};

const VideoCallout = ({
  videoScrapeInstance,
  value,
  label,
  labelStyle = "positive",
}: {
  videoScrapeInstance: Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>;
  value: string,
  label?: string;
  labelStyle?: "positive" | "negative";
}) => {
  const { Video, Selector } = videoScrapeInstance || {};
  if (!Video) return null;
  return (
    <div
      className={clsx(styles.VideoCallout,"flex gap-5 flex-col bg-zinc-900 rounded-md py-8 px-16 items-start border-slate-700 border")
      }
    >
      {label && (
        <div className="flex gap-10 items-center">
        <h5
          className={clsx(
            labelStyle === "positive" ? "bg-cyan-700" : "bg-red-900",
            "-ml-10 px-8 py-2 rounded-md"
          )}
        >
          {label}
        </h5>
        <span>{value}</span>
        </div>
      )}
      <div className="video-container rounded-md overflow-hidden">
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube-nocookie.com/embed/${Video.videoUrlId}`}
          title={`YouTube video player - ${Video.title}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <ul>
        <li>
          <a
            target="_blank"
            href={`https://www.youtube.com/watch?v=${Video.videoUrlId}`}
          >
            {Video.title}
          </a>
        </li>
        <li>{Video.description}</li>
        <li>
          Uploaded by{" "}
          {Video.Author?.link.url ? (
            <a target="_blank" href={Video.Author.link.url}>
              {Video.Author.username}
            </a>
          ) : (
            Video.Author?.username || "unknown"
          )}
        </li>
        {Selector?.username && (
          <li>
            Featured by{" "}
            {Selector?.link.url ? (
              <a target="_blank" href={Selector.link.url}>
                {Selector?.username}
              </a>
            ) : (
              `By ${Selector?.username}`
            )}
            {Selector?.username}
          </li>
        )}
      </ul>

      <details className="z-10">
        <summary>Stats for Nerds</summary>

        <ul className="flex flex-col gap-2 bg-zinc-900 p-4 rounded-md border-slate-700 border">
          <li>VideoId: {Video.videoUrlId}</li>
          <li>Author username: {Video.Author?.username}</li>
          <li>
            Author display name(s):{" "}
            {Video.Author?.display_name.map(({ name }) => name).join(", ")}
          </li>
          <li>
            Wayback Featured Links:
            <ul>
              {Video.VideoScrapeInstances.map((instance) => {
                const link = `https://web.archive.org/web/${instance.wayback_timestamp}/http://youtube.com/`;
                return (
                  <li key={instance.wayback_timestamp as unknown as number}>
                    <a href={link} target="_blank">
                      {link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
          {/* TODO: now migation to add multiple author links */}
          {/* <li>
            Author Profile Links:
            <ul>
              {Video.Author?.link.map(({ name }) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </li> */}
        </ul>
      </details>
    </div>
  );
};

const YearPageContainer = (props: YearPageProps) => {
  console.log("***** YearPageContainer", props);
  const { topVideos } = props;
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
          <VideoCallout
            label="Most Viewed"
            value={`${topVideos.mostViewedVideo?.views} views`}
            videoScrapeInstance={topVideos.mostViewedVideo}
          />
          <VideoCallout
            label="Most Rated"
            value={`${topVideos.mostRatedVideo?.ratings} ratings`}
            videoScrapeInstance={topVideos.mostRatedVideo}
          />
          <VideoCallout
            label="Top Rated"
            value={`${topVideos.topRatedVideo?.stars} stars`}
            videoScrapeInstance={topVideos.topRatedVideo}
          />
          <VideoCallout
            label="Most Discussed"
            value={`${topVideos.mostDiscussed?.comments} comments`}
            videoScrapeInstance={topVideos.mostDiscussed}
          />
          <VideoCallout
            label="Least Viewed"
            value={`${topVideos.leastViewedVideo?.views} views`}
            labelStyle="negative"
            videoScrapeInstance={topVideos.leastViewedVideo}
          />
          <VideoCallout
            label="Least Rated"
            value={`${topVideos.leastRatedVideo?.ratings} ratings`}
            labelStyle="negative"
            videoScrapeInstance={topVideos.leastRatedVideo}
          />
          <VideoCallout
            label="Lowest Rated"
            value={`${topVideos.bottomRatedVideo?.stars} stars`}
            labelStyle="negative"
            videoScrapeInstance={topVideos.bottomRatedVideo}
          />
          <VideoCallout
            label="Leader Discussed"
            value={`${topVideos.leastDiscussed?.comments} comments`}
            labelStyle="negative"
            videoScrapeInstance={topVideos.leastDiscussed}
          />
        </div>
      </section>
    </div>
  );
};

export default YearPageContainer;

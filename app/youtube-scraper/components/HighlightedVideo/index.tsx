import { getFirstVideoScrapeInstance } from "services/prisma-service/video-scrape-instance";
import clsx from "clsx";

const HighlightedVideo = ({
  videoScrapeInstance,
  value,
  label,
  sentiment,
}: {
  videoScrapeInstance: NonNullable<Awaited<ReturnType<typeof getFirstVideoScrapeInstance>>>;
  value?: string;
  label?: string;
  sentiment?: string // TODO should be enum
}) => {
  const { Video, Selector } = videoScrapeInstance;
  console.log("higkight", videoScrapeInstance)
  if(!Video){
    return null
  }
  return (
    <div className={clsx("flex gap-5 flex-col bg-zinc-900 rounded-md py-8 px-8 items-start border-slate-700 border")}>
      {label && (
        <div className="flex gap-10 items-center">
          <h5
            className={clsx(
              {
                "bg-cyan-700": sentiment == "positive",
                "bg-red-900": sentiment == "negative",
                "bg-slate-700": sentiment == "neutral",
              },
              "px-4 py-2 rounded-md"
            )}
          >
            {label}
          </h5>
          <span>{value}</span>
        </div>
      )}
      <div className="video-container rounded-md overflow-hidden">
        <iframe
          width="336"
          height="189"
          src={`https://www.youtube-nocookie.com/embed/${Video.youtubeVideoId}`}
          title={`YouTube video player - ${videoScrapeInstance.title}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <ul>
        <li>
          <a target="_blank" href={`https://www.youtube.com/watch?v=${Video.youtubeVideoId}`}>
            {videoScrapeInstance.title}
          </a>
        </li>
        <li className="max-h-20 overflow-auto">{videoScrapeInstance.description}</li>
        <li>
          Uploaded by{" "}
          <a target="_blank" href={`https://www.youtube.com/@${Video.Author.Username.name}`}>
            {Video.Author.Username.name}
          </a>
        </li>
        {Selector && (
          <li>
            Featured by{" "}
            <a target="_blank" href={`https://www.youtube.com/@${Selector.Username.name}`}>
              {Selector.Username.name}
            </a>
          </li>
        )}
      </ul>

      <details className="z-10 h-6">
        <summary>Stats for Nerds</summary>

        <ul className="flex flex-col gap-2 bg-zinc-900 p-4 rounded-md border-slate-700 border">
          <li>VideoId: {Video.youtubeVideoId}</li>
          <li>Author username: {Video.Author?.Username.name}</li>
          <li>Author display name at time of feature: {videoScrapeInstance.DisplayName.name}</li>
          {Video.Author?.DisplayName.length > 1 && (
            <li>All Author display names: {Video.Author?.DisplayName.map(({ name }) => name).join(", ")}</li>
          )}
          <li>
            Historical Author Links:
            <ul>
              {Video.Author.Links.map(({ url }) => (
                <li key={url}>
                  <a href={url} target="_blank">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            Historical Video Links:
            <ul>
              {Video.Links.map(({ url }) => (
                <li key={url}>
                  <a href={url} target="_blank">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            Wayback Homepage feature Links:
            <ul>
              {Video.VideoScrapeInstances.map((instance) => {
                const link = `https://web.archive.org/web/${instance.waybackTimestamp}/http://youtube.com/`;
                return (
                  <li key={instance.waybackTimestamp as unknown as number}>
                    <a href={link} target="_blank">
                      {link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </details>
    </div>
  );
};

export default HighlightedVideo;

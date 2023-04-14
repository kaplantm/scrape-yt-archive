import { Nullable } from "@/types/utility-types";
import { Video } from "@prisma/client";
import { useRouter } from "next/router";

type YearPageProps = {
  topVideos: {
    mostViewedVideo: Nullable<Video>;
    leastViewedVideo: Nullable<Video>;
    mostRatedVideo: Nullable<Video>;
    leastRatedVideo: Nullable<Video>;
    topRatedVideo: Nullable<Video>;
    bottomRatedVideo: Nullable<Video>;
    mostDiscussed: Nullable<Video>;
    leastDiscussed: Nullable<Video>;
  };
};

const VideoCallout = ({
  video,
  label,
}: {
  video: Nullable<Video>;
  label?: string;
}) =>
  video && (
    <div className="flex items-center flex-col">
      {label && <h5>{label}</h5>}
      <ul>

      <li>
      {video.title}
      </li>
      <li>
      {video.description}
      </li>
      <li>
      By {video.authorId}
      </li>
      <li>
      By {video.authorId}
      </li>
      </ul>
      
    </div>
  );

const YearPageContainer = (props: YearPageProps) => {
  console.log("***** YearPageContainer", props);
  const { topVideos } = props;
  const router = useRouter();
  const { year } = router.query;

  return (
    <div>
      <header>
        {year}
        <h1>Featured Videos: {year} Year in Review</h1>
      </header>

      <section>
        <div className="flex flex-wrap">
          <h2>Top Videos</h2>
          <VideoCallout label="Most Viewed" video={topVideos.mostViewedVideo} />
          <VideoCallout label="Most Rated" video={topVideos.mostRatedVideo} />
          <VideoCallout label="Top Rated" video={topVideos.topRatedVideo} />
          <VideoCallout
            label="Most Discussed"
            video={topVideos.mostDiscussed}
          />
        </div>

        <div className="flex flex-wrap">
          <h2>Bottom Videos</h2>
          <VideoCallout
            label="Least Viewed"
            video={topVideos.leastViewedVideo}
          />
          <VideoCallout label="Least Rated" video={topVideos.leastRatedVideo} />
          <VideoCallout
            label="Lowest Rated"
            video={topVideos.bottomRatedVideo}
          />
          <VideoCallout
            label="Leader Discussed"
            video={topVideos.leastDiscussed}
          />
        </div>
      </section>
    </div>
  );
};

export default YearPageContainer;

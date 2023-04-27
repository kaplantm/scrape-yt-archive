`npm install`
`npm run start:dev`

References
https://khalilstemmler.com/blogs/typescript/node-starter-project/
https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/
https://www.freecodecamp.org/news/how-to-scrape-websites-with-node-js-and-cheerio/
https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md#basic-usage
Raw data for list of snapshots: http://web.archive.org/cdx/search/cdx?url=youtube.com

LIMIT=1 FEATURE=FEATURED_1 npm run start:mock:dev
LIMIT=1 FEATURE=FEATURED_2 npm run start:mock:dev
LIMIT=1 FEATURE=FEATURED_3 npm run start:mock:dev
LIMIT=1 FEATURE=FEATURED_4 npm run start:mock:dev
LIMIT=1 FEATURE=FEATURED_5 npm run start:mock:dev
LIMIT=1 FEATURE=FEATURED_6 npm run start:mock:dev
LIMIT=1 FEATURE=FEATURED_7 npm run start:mock:dev
LIMIT=1 FEATURE=FEATURED_8 npm run start:mock:dev
FEATURE=FEATURED_8 npm run start:dev

detect video failed to load - id="error-screen"
detect private video "This video is private" or "This is a private video. Please sign in to verify that you may see it." http://www.youtube.com/watch?v=zzIMbjA5m8s


git lfs pull
start postgres locally postgres -D /usr/local/var/postgres - swapped from postgress to mysql so i can use sequelace gui
brew services start mysql

backup
pg_dump youtube_scraped -f /Users/tonikaplan/Documents/youtube_scraped_backup_feature_1.dump 

restore from dump
psql youtube_scraped < /Users/tonikaplan/Documents/youtube_scraped_backup_feature_1.dump 


<!-- // TODO: now migation to add multiple author links -->
<!-- // TODO: videos have multiple links -->
<!-- // TODO: now multiple usernames? -->
<!-- // move duration, title, description to videofeatureinstance -->
// write fails to file

// Ideas:
// longest time featured
-- // https://www.geeksengine.com/database/subquery/subquery-in-join-operation.php

SELECT DISTINCT vsiOuter.videoId,
       earliestFeature,
       latestFeature,
       (earliestFeature-latestFeature) AS diff
FROM VideoScrapeInstance AS vsiOuter
JOIN FeatureDate ON FeatureDate.id = vsiOuter.featureDateId
JOIN 
  (SELECT DISTINCT vsiInner.videoId,
          fdInner.epochDate AS earliestFeature
   FROM VideoScrapeInstance AS vsiInner
   JOIN FeatureDate AS fdInner ON fdInner.id = vsiInner.featureDateId
   GROUP BY vsiInner.videoId,
            fdInner.epochDate
   ORDER BY earliestFeature DESC) AS earliest ON vsiOuter.videoId = earliest.videoId
JOIN
  (SELECT DISTINCT vsiInnerTwo.videoId,
          fdInnerTwo.epochDate AS latestFeature
   FROM VideoScrapeInstance AS vsiInnerTwo
   JOIN FeatureDate AS fdInnerTwo ON fdInnerTwo.id = vsiInnerTwo.featureDateId
   GROUP BY vsiInnerTwo.videoId,
            fdInnerTwo.epochDate
   ORDER BY latestFeature ASC)AS latest ON vsiOuter.videoId = latest.videoId
   ORDER BY latestFeature


// most featured feature user
SELECT 
User.id,
ChannelName.name,
COUNT(DISTINCT(Video.id))
FROM 
  VideoScrapeInstance
  INNER JOIN Video ON Video.id = VideoScrapeInstance.videoId
  INNER JOIN User ON User.id = Video.authorId 
  INNER JOIN _ChannelNameToUser ON _ChannelNameToUser.B = User.id
  INNER JOIN ChannelName ON ChannelName.id = _ChannelNameToUser.A
GROUP BY 
  User.id, ChannelName.name
ORDER BY 
  COUNT(DISTINCT(Video.id)) DESC

// list all titles on fe page


// Pages:
// all time page
// month details page












SELECT DISTINCT vsi.videoId,
                earliestFeature,
                latestFeature,
                (earliestFeature-latestFeature) AS diff 
FROM VideoScrapeInstance AS vsi
JOIN
  (SELECT vsiInner.videoId,
          fdInner.epochDate AS earliestFeature
   FROM VideoScrapeInstance AS vsiInner
   JOIN FeatureDate AS fdInner ON fdInner.id = vsiInner.featureDateId
   GROUP BY vsiInner.videoId,
            fdInner.epochDate
   ORDER BY earliestFeature DESC
   LIMIT 1) AS early
JOIN
  (SELECT vsiInner.videoId,
          fdInner.epochDate AS latestFeature
   FROM VideoScrapeInstance AS vsiInner
   JOIN FeatureDate AS fdInner ON fdInner.id = vsiInner.featureDateId
   GROUP BY vsiInner.videoId,
            fdInner.epochDate
   ORDER BY latestFeature ASC
   LIMIT 1) AS late
ORDER BY diff DESC



- most viewed in value column
- video stretching
- debug fixed
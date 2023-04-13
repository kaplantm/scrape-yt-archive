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
start postgres locally postgres -D /usr/local/var/postgres


backup
pg_dump youtube_scraped -f /Users/tonikaplan/Documents/youtube_scraped_backup_feature_1.dump 

restore from dump
psql youtube_scraped < /Users/tonikaplan/Documents/youtube_scraped_backup_feature_1.dump 
/*
  Warnings:

  - You are about to drop the column `wayback_timestamp` on the `FeatureDate` table. All the data in the column will be lost.
  - You are about to drop the `FeatureInstance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeatureInstance" DROP CONSTRAINT "FeatureInstance_featureDateId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureInstance" DROP CONSTRAINT "FeatureInstance_selectorId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureInstance" DROP CONSTRAINT "FeatureInstance_videoId_fkey";

-- DropIndex
DROP INDEX "FeatureDate_wayback_timestamp_key";

-- AlterTable
ALTER TABLE "FeatureDate" DROP COLUMN "wayback_timestamp";

-- DropTable
DROP TABLE "FeatureInstance";

-- CreateTable
CREATE TABLE "VideoScrapeInstance" (
    "id" SERIAL NOT NULL,
    "age" TEXT,
    "comments" INTEGER,
    "ratings" INTEGER,
    "stars" DOUBLE PRECISION,
    "views" INTEGER,
    "feature_type" TEXT NOT NULL DEFAULT 'featured',
    "selectorId" INTEGER,
    "featureDateId" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,
    "wayback_timestamp" BIGINT NOT NULL,

    CONSTRAINT "VideoScrapeInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoScrapeInstance_wayback_timestamp_key" ON "VideoScrapeInstance"("wayback_timestamp");

-- CreateIndex
CREATE INDEX "VideoScrapeInstance_featureDateId_videoId_idx" ON "VideoScrapeInstance"("featureDateId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoScrapeInstance_videoId_wayback_timestamp_key" ON "VideoScrapeInstance"("videoId", "wayback_timestamp");

-- AddForeignKey
ALTER TABLE "VideoScrapeInstance" ADD CONSTRAINT "VideoScrapeInstance_selectorId_fkey" FOREIGN KEY ("selectorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoScrapeInstance" ADD CONSTRAINT "VideoScrapeInstance_featureDateId_fkey" FOREIGN KEY ("featureDateId") REFERENCES "FeatureDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoScrapeInstance" ADD CONSTRAINT "VideoScrapeInstance_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

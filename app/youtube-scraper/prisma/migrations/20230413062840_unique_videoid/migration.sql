/*
  Warnings:

  - A unique constraint covering the columns `[videoUrlId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_videoUrlId_key" ON "Video"("videoUrlId");

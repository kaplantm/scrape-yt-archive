-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "duration" INTEGER,
    "videoUrlId" TEXT NOT NULL,
    "uploadDate" TEXT,
    "authorId" INTEGER,
    "featureDateId" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureInstance" (
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

    CONSTRAINT "FeatureInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisplayName" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DisplayName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "linkId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureDate" (
    "id" SERIAL NOT NULL,
    "epoch_date" BIGINT NOT NULL,
    "wayback_timestamp" BIGINT NOT NULL,

    CONSTRAINT "FeatureDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DisplayNameToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TagToVideo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToVideo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_videoUrlId_key" ON "Video"("videoUrlId");

-- CreateIndex
CREATE INDEX "Video_authorId_title_videoUrlId_idx" ON "Video"("authorId", "title", "videoUrlId");

-- CreateIndex
CREATE INDEX "FeatureInstance_featureDateId_videoId_idx" ON "FeatureInstance"("featureDateId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureInstance_videoId_featureDateId_key" ON "FeatureInstance"("videoId", "featureDateId");

-- CreateIndex
CREATE UNIQUE INDEX "DisplayName_name_key" ON "DisplayName"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureDate_epoch_date_key" ON "FeatureDate"("epoch_date");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureDate_wayback_timestamp_key" ON "FeatureDate"("wayback_timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DisplayNameToUser_AB_unique" ON "_DisplayNameToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DisplayNameToUser_B_index" ON "_DisplayNameToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToVideo_AB_unique" ON "_TagToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToVideo_B_index" ON "_TagToVideo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToVideo_AB_unique" ON "_CategoryToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToVideo_B_index" ON "_CategoryToVideo"("B");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_featureDateId_fkey" FOREIGN KEY ("featureDateId") REFERENCES "FeatureDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureInstance" ADD CONSTRAINT "FeatureInstance_selectorId_fkey" FOREIGN KEY ("selectorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureInstance" ADD CONSTRAINT "FeatureInstance_featureDateId_fkey" FOREIGN KEY ("featureDateId") REFERENCES "FeatureDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureInstance" ADD CONSTRAINT "FeatureInstance_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisplayNameToUser" ADD CONSTRAINT "_DisplayNameToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "DisplayName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisplayNameToUser" ADD CONSTRAINT "_DisplayNameToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVideo" ADD CONSTRAINT "_TagToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVideo" ADD CONSTRAINT "_TagToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVideo" ADD CONSTRAINT "_CategoryToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVideo" ADD CONSTRAINT "_CategoryToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

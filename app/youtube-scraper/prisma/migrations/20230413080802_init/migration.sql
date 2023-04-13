-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
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
    "stars" INTEGER,
    "views" INTEGER,
    "selectorId" INTEGER,
    "featureDateId" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "FeatureInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureDate" (
    "id" SERIAL NOT NULL,
    "epoch_date" BIGINT NOT NULL,

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
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_link_key" ON "User"("link");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureDate_epoch_date_key" ON "FeatureDate"("epoch_date");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

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
ALTER TABLE "_TagToVideo" ADD CONSTRAINT "_TagToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVideo" ADD CONSTRAINT "_TagToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVideo" ADD CONSTRAINT "_CategoryToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVideo" ADD CONSTRAINT "_CategoryToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

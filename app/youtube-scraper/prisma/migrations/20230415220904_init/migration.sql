-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `youtubeVideoId` VARCHAR(191) NOT NULL,
    `uploadDate` VARCHAR(191) NULL,
    `authorId` INTEGER NOT NULL,

    UNIQUE INDEX `Video_youtubeVideoId_key`(`youtubeVideoId`),
    INDEX `Video_authorId_youtubeVideoId_idx`(`authorId`, `youtubeVideoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoScrapeInstance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `age` VARCHAR(191) NULL,
    `comments` INTEGER NULL,
    `ratings` INTEGER NULL,
    `stars` DOUBLE NULL,
    `views` INTEGER NULL,
    `featureType` VARCHAR(191) NOT NULL DEFAULT 'featured',
    `waybackTimestamp` BIGINT NOT NULL,
    `selectorId` INTEGER NULL,
    `featureDateId` INTEGER NOT NULL,
    `videoId` INTEGER NOT NULL,
    `displayNameId` INTEGER NOT NULL,
    `linkId` INTEGER NOT NULL,

    INDEX `VideoScrapeInstance_featureDateId_videoId_title_idx`(`featureDateId`, `videoId`, `title`),
    UNIQUE INDEX `VideoScrapeInstance_videoId_waybackTimestamp_key`(`videoId`, `waybackTimestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChannelName` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ChannelName_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `videoId` INTEGER NULL,

    UNIQUE INDEX `Link_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usernameId` INTEGER NOT NULL,

    UNIQUE INDEX `User_usernameId_key`(`usernameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeatureDate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `epochDate` BIGINT NOT NULL,

    UNIQUE INDEX `FeatureDate_epochDate_key`(`epochDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ChannelNameToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ChannelNameToUser_AB_unique`(`A`, `B`),
    INDEX `_ChannelNameToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LinkToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LinkToUser_AB_unique`(`A`, `B`),
    INDEX `_LinkToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TagToVideoScrapeInstance` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TagToVideoScrapeInstance_AB_unique`(`A`, `B`),
    INDEX `_TagToVideoScrapeInstance_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToVideoScrapeInstance` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryToVideoScrapeInstance_AB_unique`(`A`, `B`),
    INDEX `_CategoryToVideoScrapeInstance_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoScrapeInstance` ADD CONSTRAINT `VideoScrapeInstance_selectorId_fkey` FOREIGN KEY (`selectorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoScrapeInstance` ADD CONSTRAINT `VideoScrapeInstance_featureDateId_fkey` FOREIGN KEY (`featureDateId`) REFERENCES `FeatureDate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoScrapeInstance` ADD CONSTRAINT `VideoScrapeInstance_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoScrapeInstance` ADD CONSTRAINT `VideoScrapeInstance_displayNameId_fkey` FOREIGN KEY (`displayNameId`) REFERENCES `ChannelName`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoScrapeInstance` ADD CONSTRAINT `VideoScrapeInstance_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_usernameId_fkey` FOREIGN KEY (`usernameId`) REFERENCES `ChannelName`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ChannelNameToUser` ADD CONSTRAINT `_ChannelNameToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `ChannelName`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ChannelNameToUser` ADD CONSTRAINT `_ChannelNameToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LinkToUser` ADD CONSTRAINT `_LinkToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Link`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LinkToUser` ADD CONSTRAINT `_LinkToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TagToVideoScrapeInstance` ADD CONSTRAINT `_TagToVideoScrapeInstance_A_fkey` FOREIGN KEY (`A`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TagToVideoScrapeInstance` ADD CONSTRAINT `_TagToVideoScrapeInstance_B_fkey` FOREIGN KEY (`B`) REFERENCES `VideoScrapeInstance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToVideoScrapeInstance` ADD CONSTRAINT `_CategoryToVideoScrapeInstance_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToVideoScrapeInstance` ADD CONSTRAINT `_CategoryToVideoScrapeInstance_B_fkey` FOREIGN KEY (`B`) REFERENCES `VideoScrapeInstance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `featureDateId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "featureDateId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_featureDateId_fkey" FOREIGN KEY ("featureDateId") REFERENCES "FeatureDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

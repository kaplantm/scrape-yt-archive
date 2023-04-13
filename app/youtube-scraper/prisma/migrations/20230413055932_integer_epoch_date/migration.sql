/*
  Warnings:

  - Changed the type of `epoch_date` on the `FeatureDate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FeatureDate" DROP COLUMN "epoch_date",
ADD COLUMN     "epoch_date" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FeatureDate_epoch_date_key" ON "FeatureDate"("epoch_date");

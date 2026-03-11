/*
  Warnings:

  - Made the column `profileName` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientName` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `serviceLine` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quote` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `queryStatus` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversationStatus` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "profileName" SET NOT NULL,
ALTER COLUMN "clientName" SET NOT NULL,
ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "serviceLine" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "quote" SET NOT NULL,
ALTER COLUMN "queryStatus" SET NOT NULL,
ALTER COLUMN "conversationStatus" SET NOT NULL;

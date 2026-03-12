/*
  Warnings:

  - The values [SPAM,CONVERSATION_RUNNING] on the enum `QueryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QueryStatus_new" AS ENUM ('CUSTOM_OFFER_SENT', 'BRIEF_CUSTOM_OFFER_SENT', 'BRIEF_REPLIED', 'QUOTE_SENT', 'FEATURE_LIST_SENT', 'NO_RESPONSE', 'PASS', 'LOW_FOCUS_COUNTRY', 'NONE');
ALTER TABLE "Project" ALTER COLUMN "queryStatus" TYPE "QueryStatus_new" USING ("queryStatus"::text::"QueryStatus_new");
ALTER TYPE "QueryStatus" RENAME TO "QueryStatus_old";
ALTER TYPE "QueryStatus_new" RENAME TO "QueryStatus";
DROP TYPE "QueryStatus_old";
COMMIT;

/*
  Warnings:

  - The values [N8N_AUTOMATION] on the enum `ServiceLine` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ServiceLine_new" AS ENUM ('CUSTOM_WEBSITE', 'MOBILE_APP', 'AI_MOBILE_APP', 'AI_WEBSITE', 'AI_AGENT', 'CHATBOT', 'NOT_CLARIFIED', 'AUTOMATION', 'BUG_FIXING', 'BETTING_PASS', 'WIX', 'FIGMA', 'NEED_JOB_PASS', 'NEED_LEARNING_PASS', 'NONE');
ALTER TABLE "Project" ALTER COLUMN "serviceLine" TYPE "ServiceLine_new" USING ("serviceLine"::text::"ServiceLine_new");
ALTER TYPE "ServiceLine" RENAME TO "ServiceLine_old";
ALTER TYPE "ServiceLine_new" RENAME TO "ServiceLine";
DROP TYPE "ServiceLine_old";
COMMIT;

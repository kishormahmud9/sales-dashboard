/*
  Warnings:

  - The values [INITIAL,FOLLOW_UP,NEGOTIATION,WON,LOST] on the enum `ConversationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PLACEHOLDER_1,PLACEHOLDER_2] on the enum `ProfileName` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_PROGRESS,CLOSED] on the enum `QueryStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [WEB_DEVELOPMENT,UI_UX] on the enum `ServiceLine` will be removed. If these variants are still used in the database, this will fail.
  - The values [UPWORK,LINKEDIN,DIRECT] on the enum `Source` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConversationStatus_new" AS ENUM ('NEED_TO_FOLLOW_UP', 'FOLLOW_UP_DONE', 'SOLD', 'NEVER_CAME', 'FOUND_OTHER_DEV', 'NO_NEED_TO_FOLLOW_UP');
ALTER TABLE "Project" ALTER COLUMN "conversationStatus" TYPE "ConversationStatus_new" USING ("conversationStatus"::text::"ConversationStatus_new");
ALTER TYPE "ConversationStatus" RENAME TO "ConversationStatus_old";
ALTER TYPE "ConversationStatus_new" RENAME TO "ConversationStatus";
DROP TYPE "public"."ConversationStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProfileName_new" AS ENUM ('BYTE_CRAFT', 'DRIFT_AI', 'FIRE_AI', 'AI_BYTE', 'AI_HOOK', 'AI_NEST', 'ZEBRA_APP', 'TURTLE_APP', 'LOGIC_AI');
ALTER TABLE "Project" ALTER COLUMN "profileName" TYPE "ProfileName_new" USING ("profileName"::text::"ProfileName_new");
ALTER TYPE "ProfileName" RENAME TO "ProfileName_old";
ALTER TYPE "ProfileName_new" RENAME TO "ProfileName";
DROP TYPE "public"."ProfileName_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QueryStatus_new" AS ENUM ('CUSTOM_OFFER_SENT', 'BRIEF_CUSTOM_OFFER_SENT', 'BRIEF_REPLIED', 'QUOTE_SENT', 'FEATURE_LIST_SENT', 'NO_RESPONSE', 'PASS', 'SPAM', 'LOW_FOCUS_COUNTRY', 'CONVERSATION_RUNNING');
ALTER TABLE "Project" ALTER COLUMN "queryStatus" TYPE "QueryStatus_new" USING ("queryStatus"::text::"QueryStatus_new");
ALTER TYPE "QueryStatus" RENAME TO "QueryStatus_old";
ALTER TYPE "QueryStatus_new" RENAME TO "QueryStatus";
DROP TYPE "public"."QueryStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceLine_new" AS ENUM ('CUSTOM_WEBSITE', 'MOBILE_APP', 'AI_MOBILE_APP', 'AI_WEBSITE', 'AI_AGENT', 'CHATBOT', 'NOT_CLARIFIED', 'N8N_AUTOMATION', 'BUG_FIXING');
ALTER TABLE "Project" ALTER COLUMN "serviceLine" TYPE "ServiceLine_new" USING ("serviceLine"::text::"ServiceLine_new");
ALTER TYPE "ServiceLine" RENAME TO "ServiceLine_old";
ALTER TYPE "ServiceLine_new" RENAME TO "ServiceLine";
DROP TYPE "public"."ServiceLine_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Source_new" AS ENUM ('QUERY', 'BRIEF', 'PROMOTED', 'DIRECT_ORDER', 'REFERRAL');
ALTER TABLE "Project" ALTER COLUMN "source" TYPE "Source_new" USING ("source"::text::"Source_new");
ALTER TYPE "Source" RENAME TO "Source_old";
ALTER TYPE "Source_new" RENAME TO "Source";
DROP TYPE "public"."Source_old";
COMMIT;

-- AlterEnum
ALTER TYPE "ConversationStatus" ADD VALUE 'NONE';

-- AlterEnum
ALTER TYPE "ProfileName" ADD VALUE 'NONE';

-- AlterEnum
ALTER TYPE "QueryStatus" ADD VALUE 'NONE';

-- AlterEnum
ALTER TYPE "ServiceLine" ADD VALUE 'NONE';

-- AlterEnum
ALTER TYPE "Source" ADD VALUE 'NONE';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "profileName" DROP NOT NULL,
ALTER COLUMN "clientName" DROP NOT NULL,
ALTER COLUMN "source" DROP NOT NULL,
ALTER COLUMN "serviceLine" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "quote" DROP NOT NULL,
ALTER COLUMN "queryStatus" DROP NOT NULL,
ALTER COLUMN "conversationStatus" DROP NOT NULL;

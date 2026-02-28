-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_soldById_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "soldById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_soldById_fkey" FOREIGN KEY ("soldById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

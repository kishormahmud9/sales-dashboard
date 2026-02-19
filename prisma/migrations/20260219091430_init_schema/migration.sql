-- CreateEnum
CREATE TYPE "Role" AS ENUM ('superAdmin', 'sales_tl', 'sales_member', 'operation_tl', 'operation_member', 'sales_admin', 'operation_admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive', 'banned');

-- CreateEnum
CREATE TYPE "ProfileName" AS ENUM ('PLACEHOLDER_1', 'PLACEHOLDER_2');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('UPWORK', 'LINKEDIN', 'DIRECT');

-- CreateEnum
CREATE TYPE "ServiceLine" AS ENUM ('WEB_DEVELOPMENT', 'MOBILE_APP', 'UI_UX');

-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('INITIAL', 'FOLLOW_UP', 'NEGOTIATION', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'sales_member',
    "image" TEXT,
    "status" "Status" NOT NULL DEFAULT 'active',
    "total_queries" INTEGER NOT NULL DEFAULT 0,
    "converted_queries" INTEGER NOT NULL DEFAULT 0,
    "quote_sent" INTEGER NOT NULL DEFAULT 0,
    "conversion_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "profileName" "ProfileName" NOT NULL,
    "clientName" TEXT NOT NULL,
    "source" "Source" NOT NULL,
    "serviceLine" "ServiceLine" NOT NULL,
    "country" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "queryStatus" "QueryStatus" NOT NULL,
    "followupCount" INTEGER NOT NULL DEFAULT 0,
    "conversationStatus" "ConversationStatus" NOT NULL,
    "soldById" TEXT NOT NULL,
    "comment" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_soldById_fkey" FOREIGN KEY ("soldById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

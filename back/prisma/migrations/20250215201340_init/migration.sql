-- CreateEnum
CREATE TYPE "RoleGender" AS ENUM ('MAN', 'WOMAN', 'All');

-- CreateTable
CREATE TABLE "Expert" (
    "id" UUID NOT NULL,
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "isStatus" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "age" TEXT,
    "phone" TEXT,
    "province" TEXT,
    "city" TEXT,
    "gender" "RoleGender",
    "jobStatus" BOOLEAN,
    "jobLocation" TEXT,
    "jobTitle" TEXT,
    "jobTime" TEXT,
    "image" TEXT,
    "password" TEXT NOT NULL,
    "verifyPass" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expert_phone_key" ON "Expert"("phone");

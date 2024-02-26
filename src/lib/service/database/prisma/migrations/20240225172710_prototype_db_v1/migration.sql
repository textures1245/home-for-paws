/*
  Warnings:

  - You are about to drop the column `userUuid` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `roomChatId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `userUuid` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `_ChatRoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authUuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostUserUuid` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestUserUuid` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `budget` on the `DataAnalytics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `roomChatUuid` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userUuid` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `payeeUuid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payerUuid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `chatRoomUuid` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerAs` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Proposal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `authUuid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('DOG', 'CAT');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_userUuid_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomChatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userUuid_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userUuid_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_B_fkey";

-- DropIndex
DROP INDEX "Auth_userUuid_key";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "userUuid";

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "adopterListUuid" UUID,
ADD COLUMN     "hostUserUuid" UUID NOT NULL,
ADD COLUMN     "petDeliveryListUuid" UUID,
ADD COLUMN     "requestUserUuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "DataAnalytics" DROP COLUMN "budget",
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "roomChatId",
ADD COLUMN     "roomChatUuid" UUID NOT NULL,
DROP COLUMN "userUuid",
ADD COLUMN     "userUuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "date",
DROP COLUMN "userUuid",
ADD COLUMN     "paidDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payeeUuid" UUID NOT NULL,
ADD COLUMN     "payerUuid" UUID NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "adopterListUuid" UUID,
DROP COLUMN "type",
ADD COLUMN     "type" "PetType" NOT NULL;

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "adopterListUuid" UUID,
ADD COLUMN     "chatRoomUuid" UUID NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "offerAs" "Role" NOT NULL,
ADD COLUMN     "petDeliveryListUuid" UUID,
DROP COLUMN "status",
ADD COLUMN     "status" "ProposalStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authUuid" UUID NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ChatRoomToUser";

-- CreateTable
CREATE TABLE "AdopterList" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerUuid" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "minPrice" DOUBLE PRECISION NOT NULL,
    "willingnessToTravel" BOOLEAN NOT NULL,

    CONSTRAINT "AdopterList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetDeliveryList" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerUuid" UUID NOT NULL,
    "petUuid" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "minPrice" DOUBLE PRECISION NOT NULL,
    "willingnessToTravel" BOOLEAN NOT NULL,

    CONSTRAINT "PetDeliveryList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdopterList_uuid_key" ON "AdopterList"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PetDeliveryList_uuid_key" ON "PetDeliveryList"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_authUuid_key" ON "User"("authUuid");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_authUuid_fkey" FOREIGN KEY ("authUuid") REFERENCES "Auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payeeUuid_fkey" FOREIGN KEY ("payeeUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerUuid_fkey" FOREIGN KEY ("payerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_adopterListUuid_fkey" FOREIGN KEY ("adopterListUuid") REFERENCES "AdopterList"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_adopterListUuid_fkey" FOREIGN KEY ("adopterListUuid") REFERENCES "AdopterList"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_petDeliveryListUuid_fkey" FOREIGN KEY ("petDeliveryListUuid") REFERENCES "PetDeliveryList"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_requestUserUuid_fkey" FOREIGN KEY ("requestUserUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_hostUserUuid_fkey" FOREIGN KEY ("hostUserUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomChatUuid_fkey" FOREIGN KEY ("roomChatUuid") REFERENCES "ChatRoom"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_chatRoomUuid_fkey" FOREIGN KEY ("chatRoomUuid") REFERENCES "ChatRoom"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_adopterListUuid_fkey" FOREIGN KEY ("adopterListUuid") REFERENCES "AdopterList"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_petDeliveryListUuid_fkey" FOREIGN KEY ("petDeliveryListUuid") REFERENCES "PetDeliveryList"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterList" ADD CONSTRAINT "AdopterList_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetDeliveryList" ADD CONSTRAINT "PetDeliveryList_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetDeliveryList" ADD CONSTRAINT "PetDeliveryList_petUuid_fkey" FOREIGN KEY ("petUuid") REFERENCES "Pet"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

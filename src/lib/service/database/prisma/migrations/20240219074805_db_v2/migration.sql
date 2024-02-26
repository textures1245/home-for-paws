/*
  Warnings:

  - You are about to drop the column `userUuid` on the `Review` table. All the data in the column will be lost.
  - Made the column `email` on table `Contacts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Contacts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roomChatId` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `petOwnerUuid` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerUuid` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserUuid` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomChatId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userUuid_fkey";

-- AlterTable
ALTER TABLE "Contacts" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "roomChatId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "petOwnerUuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "toOfferingUserUuid" UUID;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userUuid",
ADD COLUMN     "ownerUuid" UUID NOT NULL,
ADD COLUMN     "toUserUuid" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_toUserUuid_fkey" FOREIGN KEY ("toUserUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_petOwnerUuid_fkey" FOREIGN KEY ("petOwnerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomChatId_fkey" FOREIGN KEY ("roomChatId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_toOfferingUserUuid_fkey" FOREIGN KEY ("toOfferingUserUuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

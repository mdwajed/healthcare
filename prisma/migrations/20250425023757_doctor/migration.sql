/*
  Warnings:

  - You are about to drop the column `profilePhoto` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "profilePhoto",
ADD COLUMN     "profilePicture" TEXT;

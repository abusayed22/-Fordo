/*
  Warnings:

  - You are about to drop the column `isDelete` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "isDelete",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

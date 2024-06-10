/*
  Warnings:

  - You are about to drop the column `linkPrecedent` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "linkPrecedent",
ADD COLUMN     "linkPrecedence" TEXT NOT NULL DEFAULT 'primary';

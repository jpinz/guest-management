/*
  Warnings:

  - You are about to drop the column `contact_email` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `contactEmail` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "contact_email",
ADD COLUMN     "contactEmail" TEXT NOT NULL;

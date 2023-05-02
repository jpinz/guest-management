/*
  Warnings:

  - The values [NONBINARY] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `eventId` on table `EventGuest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE', 'OTHER');
ALTER TABLE "PersonalGuest" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TABLE "EventGuest" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "EventGuest" DROP CONSTRAINT "EventGuest_eventId_fkey";

-- AlterTable
ALTER TABLE "EventGuest" ALTER COLUMN "eventId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventGuest" ADD CONSTRAINT "EventGuest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

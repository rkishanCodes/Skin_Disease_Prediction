/*
  Warnings:

  - You are about to drop the column `diseaseId` on the `Record` table. All the data in the column will be lost.
  - Added the required column `patientId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_diseaseId_fkey";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "doctorId" INTEGER;

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "diseaseId",
ADD COLUMN     "patientId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

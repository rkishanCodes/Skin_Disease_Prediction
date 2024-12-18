-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "consultationStatus" "ConsultationStatus" NOT NULL DEFAULT 'PENDING';

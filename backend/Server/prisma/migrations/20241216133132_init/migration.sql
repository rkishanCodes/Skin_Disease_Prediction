/*
  Warnings:

  - Added the required column `username` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "username" TEXT NOT NULL;

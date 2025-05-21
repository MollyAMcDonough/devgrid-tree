/*
  Warnings:

  - Added the required column `children_count` to the `Factory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factory" ADD COLUMN     "children_count" INTEGER NOT NULL;

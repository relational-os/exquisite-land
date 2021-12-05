/*
  Warnings:

  - Added the required column `status` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `svg` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Tile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tile" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "svg" TEXT NOT NULL,
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL,
ADD COLUMN     "owner" TEXT NOT NULL;
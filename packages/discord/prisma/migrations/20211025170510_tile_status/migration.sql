/*
  Warnings:

  - You are about to drop the `TileStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TileStatus";

-- CreateTable
CREATE TABLE "Tile" (
    "id" TEXT NOT NULL,
    "discordSent" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tile.id_unique" ON "Tile"("id");

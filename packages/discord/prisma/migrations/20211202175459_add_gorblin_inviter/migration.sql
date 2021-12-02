-- CreateTable
CREATE TABLE "GorblinInviter" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "inviteTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

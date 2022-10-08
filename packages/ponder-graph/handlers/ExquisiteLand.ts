import { BigNumber } from "ethers";
import { Context } from "../generated/context";
import {
  SeedCreatedHandler,
  NeighborInvitedHandler,
  TileCreatedHandler,
  TileResetHandler,
  TransferHandler,
} from "../generated/ExquisiteLand";

const createTileToken = async (
  tokenId: BigNumber,
  receipient: string,
  timestamp: number,
  context: Context
) => {
  const { Player, Tile } = context.entities;

  console.log("tokenid", tokenId);
  const x = (tokenId & 0xff00) >> 8;
  const y = tokenId & 0xff;

  const player = await Player.get(receipient);
  if (!player) {
    await Player.insert({
      id: receipient,
      address: receipient,
    });
  }

  await Tile.insert({
    id: `${tokenId}`,
    x: x,
    y: y,
    status: "UNLOCKED",
    createdAtExquisite: timestamp,
    updatedAtExquisite: timestamp,
    owner: receipient,
  });
};

const handleSeedCreated: SeedCreatedHandler = async (event, context) => {
  await createTileToken(
    event.params.tokenId,
    event.params.recipient,
    event.block.timestamp,
    context
  );
};

const handleNeighborInvited: NeighborInvitedHandler = async (
  event,
  context
) => {
  await createTileToken(
    event.params.tokenId,
    event.params.recipient,
    event.block.timestamp,
    context
  );
};

const handleTileCreated: TileCreatedHandler = async (event, context) => {
  const { Tile } = context.entities;
  let tokenId = event.params.tokenId;

  let svg = await context.contracts.ExquisiteLand.getTileSVG(tokenId);

  // console.log(svg);

  await Tile.update({
    id: tokenId.toString(),
    status: "LOCKED",
    filledAt: event.block.timestamp,
    updatedAtExquisite: event.block.timestamp,
    svg: svg,
  });

  return;
};

const handleTileReset: TileResetHandler = async (event, context) => {
  const { Tile } = context.entities;
  let tokenId = event.params.tokenId;

  await Tile.update({
    id: tokenId.toString(),
    status: "UNLOCKED",
    updatedAtExquisite: event.block.timestamp,
    svg: undefined,
  });

  return;
};

const handleTransfer: TransferHandler = async (event, context) => {
  const { Player, Tile } = context.entities;

  const fromAddr = event.params.from;
  const toAddr = event.params.to;
  const tokenId = event.params.tokenId;

  const fromWallet = await Player.get(fromAddr);
  if (!fromWallet) {
    await Player.insert({
      id: fromAddr,
      address: fromAddr,
    });
  }

  const toWallet = await Player.get(toAddr);
  if (!toWallet) {
    await Player.insert({
      id: toAddr,
      address: toAddr,
    });
  }

  const tile = await Tile.get(tokenId.toString());
  if (tile) {
    await Tile.update({
      id: tokenId.toString(),
      owner: toAddr,
      updatedAtExquisite: event.block.timestamp,
    });
  }
};

export const ExquisiteLand = {
  SeedCreated: handleSeedCreated,
  NeighborInvited: handleNeighborInvited,
  TileCreated: handleTileCreated,
  TileReset: handleTileReset,
  Transfer: handleTransfer,
};

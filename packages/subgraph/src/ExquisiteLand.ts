import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";
import { Player, Tile } from "../generated/schema";
import {
  NeighborInvited,
  SeedCreated,
  ExquisiteLand,
  TileCreated,
  Transfer,
} from "../generated/ExquisiteLand/ExquisiteLand";

// test

function createTileToken(
  tokenId: BigInt,
  recipient: Address,
  address: Address
): void {
  let contract = ExquisiteLand.bind(address);

  let result = contract.getCoordinates(tokenId);

  let x = result.value0;
  let y = result.value1;

  let tile = new Tile(tokenId.toString());

  let player = Player.load(recipient.toString());
  if (!player) {
    player = new Player(recipient.toHexString());
    player.address = ByteArray.fromHexString(recipient.toHexString()) as Bytes;
    player.save();
  }
  tile.owner = player.id;

  tile.x = x;
  tile.y = y;
  tile.status = "UNLOCKED";
  tile.save();
}

export function handleSeedCreated(event: SeedCreated): void {
  createTileToken(event.params.tokenId, event.params.recipient, event.address);
}

export function handleNeighborInvited(event: NeighborInvited): void {
  createTileToken(event.params.tokenId, event.params.recipient, event.address);
}

export function handleTileCreated(event: TileCreated): void {
  let tokenID = event.params.tokenId;
  let tile = Tile.load(tokenID.toString());
  tile.svg = ExquisiteLand.bind(event.address).getTileSVG(tokenID);
  tile.status = "LOCKED";
  tile.save();
}

export function handleTileTransfer(event: Transfer): void {
  let fromAddress = event.params.from;
  let toAddress = event.params.to;
  let tokenId = event.params.tokenId;

  let fromId = fromAddress.toHex();
  let fromWallet = Player.load(fromId);
  if (!fromWallet) {
    fromWallet = new Player(fromId);
    fromWallet.address = fromAddress;
    fromWallet.save();
  }

  let toId = toAddress.toHex();
  let toWallet = Player.load(toId);
  if (!toWallet) {
    toWallet = new Player(toId);
    toWallet.address = toAddress;
    toWallet.save();
  }

  let tile = Tile.load(tokenId.toString());
  if (tile != null) {
    tile.owner = toWallet.id;
    tile.save();
  }
}

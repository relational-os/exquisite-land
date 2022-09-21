import { Address, BigInt, ByteArray, Bytes } from '@graphprotocol/graph-ts';
import { Canvas, Player, Tile } from '../generated/schema';
import {
  NeighborInvited,
  SeedCreated,
  TileCreated,
  Canvas2,
  Transfer,
  TileReset
} from '../generated/Canvas2/Canvas2';
import {
  SlimePooled
} from '../generated/SlimePools/SlimePools';
import { ExquisiteLand } from '../../subgraph/generated/ExquisiteLand/ExquisiteLand';

export function handleSlimePooled(event: SlimePooled): void {
  let tile = Tile.load(event.params.tokenId.toString());
  if (tile) {
    tile.pooledSlime = tile.pooledSlime.plus(event.params.amount);
    tile.save();
  }
}

// TODO: add purchaseable tile metadata
// TODO: helper function to pull in MATIC XQST Canvas 1 and hardcode CanvasID value?

function createTileToken(
  tokenId: BigInt,
  recipient: Address,
  address: Address,
  timestamp: BigInt,
  canvasId: String
): void {
  let contract = Canvas2.bind(address);
  let result = contract.getCoordinates(tokenId);
  let x = result.value0;
  let y = result.value1;
  let tile = new Tile(tokenId.toString());
  let player = Player.load(recipient.toString());

  let canvas = Canvas.load(canvasId.toString());
  if (!canvas) {
    canvas = new Canvas(canvasId.toString());
    canvas.save();
  }
  tile.canvas = canvas.id;

  if (!player) {
    player = new Player(recipient.toHexString());
    player.address = ByteArray.fromHexString(recipient.toHexString()) as Bytes;
    player.save();
  }
  tile.owner = player.id;
  tile.x = x;
  tile.y = y;
  tile.status = 'UNLOCKED';
  tile.createdAt = timestamp;
  tile.updatedAt = timestamp;
  tile.pooledSlime = BigInt.fromString("0");
  tile.save();
}

export function handleSeedCreated(event: SeedCreated): void {
  createTileToken(
    event.params.tokenId,
    event.params.recipient,
    event.address,
    event.block.timestamp,
    "2"
  );
}

export function handleNeighborInvited(event: NeighborInvited): void {
  createTileToken(
    event.params.tokenId,
    event.params.recipient,
    event.address,
    event.block.timestamp,
    "2"
  );
}


export function handleTileCreated(event: TileCreated): void {
  let tokenID = event.params.tokenId;
  let tile = Tile.load(tokenID.toString());
  if (tile) {

    let canvas = Canvas.load("2");
    if (!canvas) {
      canvas = new Canvas("2");
      canvas.save();
    }
    tile.canvas = canvas.id;

    tile.svg = Canvas2.bind(event.address).getTileSVG(tokenID);
    tile.status = 'LOCKED';
    tile.filledAt = event.block.timestamp;
    tile.updatedAt = event.block.timestamp;
    tile.save();
  }
}

// Picks up event for Canvas 1 only
export function handleTileCreatedLegacy(event: TileCreated): void {
  let tokenID = event.params.tokenId;
  let tile = Tile.load(tokenID.toString());
  if (tile) {
    tile.svg = ExquisiteLand.bind(event.address).getTileSVG(tokenID);
    tile.status = 'LOCKED';
    tile.filledAt = event.block.timestamp;
    tile.updatedAt = event.block.timestamp;

    let canvas = Canvas.load("1");
    if (!canvas) {
      canvas = new Canvas("1");
      canvas.save();
    }
    tile.canvas = canvas.id;

    tile.save();
  }
}

export function handleTileReset(event: TileReset): void {
  let tokenID = event.params.tokenId;
  let tile = Tile.load(tokenID.toString());
  if (tile) {

    let canvas = Canvas.load("2");
    if (!canvas) {
      canvas = new Canvas("2");
      canvas.save();
    }
    tile.canvas = canvas.id;

    tile.svg = null;
    tile.status = 'UNLOCKED';
    tile.updatedAt = event.block.timestamp;
    tile.save();
  }
}

export function handleTileResetLegacy(event: TileReset): void {
  let tokenID = event.params.tokenId;
  let tile = Tile.load(tokenID.toString());
  if (tile) {

    let canvas = Canvas.load("1");
    if (!canvas) {
      canvas = new Canvas("1");
      canvas.save();
    }
    tile.canvas = canvas.id;

    tile.svg = null;
    tile.status = 'UNLOCKED';
    tile.updatedAt = event.block.timestamp;
    tile.save();
  }
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
    tile.updatedAt = event.block.timestamp;
    tile.save();
  }
}

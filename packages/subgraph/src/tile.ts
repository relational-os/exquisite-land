import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  json
} from '@graphprotocol/graph-ts';
import { Canvas, Player, Tile } from '../generated/schema';
import {
  NeighborInvited,
  SeedCreated,
  Tile as TileContract,
  TileCreated
} from '../generated/Tile/Tile';

function createTileToken(
  tokenId: BigInt,
  recipient: Address,
  address: Address
): void {
  let contract = TileContract.bind(address);

  let results = contract.getCoordinates(tokenId);

  let canvasId = results.value0;
  let x = results.value1;
  let y = results.value2;

  let tile = new Tile(tokenId.toString());

  let canvas = Canvas.load(canvasId.toString());
  if (!canvas) {
    // create canvas if it does not exist
    canvas = new Canvas(canvasId.toString());

    canvas.palette = contract.getPalette(canvasId);

    canvas.save();
  }
  tile.canvas = canvas.id;

  let player = Player.load(recipient.toString());
  if (!player) {
    player = new Player(recipient.toHexString());
    player.address = ByteArray.fromHexString(recipient.toHexString()) as Bytes;
    player.save();
  }
  tile.owner = player.id;

  tile.x = x;
  tile.y = y;
  tile.status = 'UNLOCKED';
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
  tile.svg = TileContract.bind(event.address).getTileSVG(tokenID);
  tile.save();
}

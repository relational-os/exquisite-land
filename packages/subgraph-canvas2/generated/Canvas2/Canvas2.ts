// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get approved(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class InviteCoinCreated extends ethereum.Event {
  get params(): InviteCoinCreated__Params {
    return new InviteCoinCreated__Params(this);
  }
}

export class InviteCoinCreated__Params {
  _event: InviteCoinCreated;

  constructor(event: InviteCoinCreated) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class InviteCoinUsed extends ethereum.Event {
  get params(): InviteCoinUsed__Params {
    return new InviteCoinUsed__Params(this);
  }
}

export class InviteCoinUsed__Params {
  _event: InviteCoinUsed;

  constructor(event: InviteCoinUsed) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get recipient(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get coinCreator(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class NeighborInvited extends ethereum.Event {
  get params(): NeighborInvited__Params {
    return new NeighborInvited__Params(this);
  }
}

export class NeighborInvited__Params {
  _event: NeighborInvited;

  constructor(event: NeighborInvited) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get recipient(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class SeedCreated extends ethereum.Event {
  get params(): SeedCreated__Params {
    return new SeedCreated__Params(this);
  }
}

export class SeedCreated__Params {
  _event: SeedCreated;

  constructor(event: SeedCreated) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get recipient(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TileCreated extends ethereum.Event {
  get params(): TileCreated__Params {
    return new TileCreated__Params(this);
  }
}

export class TileCreated__Params {
  _event: TileCreated;

  constructor(event: TileCreated) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get sender(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TileGorblinified extends ethereum.Event {
  get params(): TileGorblinified__Params {
    return new TileGorblinified__Params(this);
  }
}

export class TileGorblinified__Params {
  _event: TileGorblinified;

  constructor(event: TileGorblinified) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TileReset extends ethereum.Event {
  get params(): TileReset__Params {
    return new TileReset__Params(this);
  }
}

export class TileReset__Params {
  _event: TileReset;

  constructor(event: TileReset) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Canvas2__getCoordinatesResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class Canvas2 extends ethereum.SmartContract {
  static bind(address: Address): Canvas2 {
    return new Canvas2("Canvas2", address);
  }

  LOOKUP(param0: BigInt): string {
    let result = super.call("LOOKUP", "LOOKUP(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toString();
  }

  try_LOOKUP(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("LOOKUP", "LOOKUP(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  PALETTE(): Bytes {
    let result = super.call("PALETTE", "PALETTE():(bytes)", []);

    return result[0].toBytes();
  }

  try_PALETTE(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("PALETTE", "PALETTE():(bytes)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  XQST_HEADER(): Bytes {
    let result = super.call("XQST_HEADER", "XQST_HEADER():(bytes)", []);

    return result[0].toBytes();
  }

  try_XQST_HEADER(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("XQST_HEADER", "XQST_HEADER():(bytes)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  _svgData(param0: BigInt): Address {
    let result = super.call("_svgData", "_svgData(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try__svgData(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("_svgData", "_svgData(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  balanceOf(owner: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(owner: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  generateSecret(
    canvasId: BigInt,
    tokenId: BigInt,
    inviterTokenId: BigInt,
    pin: Bytes
  ): Bytes {
    let result = super.call(
      "generateSecret",
      "generateSecret(uint256,uint256,uint256,bytes8):(bytes32)",
      [
        ethereum.Value.fromUnsignedBigInt(canvasId),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(inviterTokenId),
        ethereum.Value.fromFixedBytes(pin)
      ]
    );

    return result[0].toBytes();
  }

  try_generateSecret(
    canvasId: BigInt,
    tokenId: BigInt,
    inviterTokenId: BigInt,
    pin: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "generateSecret",
      "generateSecret(uint256,uint256,uint256,bytes8):(bytes32)",
      [
        ethereum.Value.fromUnsignedBigInt(canvasId),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(inviterTokenId),
        ethereum.Value.fromFixedBytes(pin)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  generateTokenID(x: BigInt, y: BigInt): BigInt {
    let result = super.call(
      "generateTokenID",
      "generateTokenID(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(x),
        ethereum.Value.fromUnsignedBigInt(y)
      ]
    );

    return result[0].toBigInt();
  }

  try_generateTokenID(x: BigInt, y: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "generateTokenID",
      "generateTokenID(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(x),
        ethereum.Value.fromUnsignedBigInt(y)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getApproved(tokenId: BigInt): Address {
    let result = super.call("getApproved", "getApproved(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toAddress();
  }

  try_getApproved(tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getApproved",
      "getApproved(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getCoordinates(tokenId: BigInt): Canvas2__getCoordinatesResult {
    let result = super.call(
      "getCoordinates",
      "getCoordinates(uint256):(uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );

    return new Canvas2__getCoordinatesResult(
      result[0].toBigInt(),
      result[1].toBigInt()
    );
  }

  try_getCoordinates(
    tokenId: BigInt
  ): ethereum.CallResult<Canvas2__getCoordinatesResult> {
    let result = super.tryCall(
      "getCoordinates",
      "getCoordinates(uint256):(uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Canvas2__getCoordinatesResult(
        value[0].toBigInt(),
        value[1].toBigInt()
      )
    );
  }

  getTileSVG(tokenId: BigInt): string {
    let result = super.call("getTileSVG", "getTileSVG(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toString();
  }

  try_getTileSVG(tokenId: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("getTileSVG", "getTileSVG(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  inviteIsValid(
    senderX: BigInt,
    senderY: BigInt,
    inviteX: BigInt,
    inviteY: BigInt
  ): boolean {
    let result = super.call(
      "inviteIsValid",
      "inviteIsValid(uint256,uint256,uint256,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(senderX),
        ethereum.Value.fromUnsignedBigInt(senderY),
        ethereum.Value.fromUnsignedBigInt(inviteX),
        ethereum.Value.fromUnsignedBigInt(inviteY)
      ]
    );

    return result[0].toBoolean();
  }

  try_inviteIsValid(
    senderX: BigInt,
    senderY: BigInt,
    inviteX: BigInt,
    inviteY: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "inviteIsValid",
      "inviteIsValid(uint256,uint256,uint256,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(senderX),
        ethereum.Value.fromUnsignedBigInt(senderY),
        ethereum.Value.fromUnsignedBigInt(inviteX),
        ethereum.Value.fromUnsignedBigInt(inviteY)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  inviteSecrets(param0: Bytes): boolean {
    let result = super.call("inviteSecrets", "inviteSecrets(bytes32):(bool)", [
      ethereum.Value.fromFixedBytes(param0)
    ]);

    return result[0].toBoolean();
  }

  try_inviteSecrets(param0: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "inviteSecrets",
      "inviteSecrets(bytes32):(bool)",
      [ethereum.Value.fromFixedBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isApprovedForAll(owner: Address, operator: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(operator)]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    owner: Address,
    operator: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(operator)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isTrustedForwarder(forwarder: Address): boolean {
    let result = super.call(
      "isTrustedForwarder",
      "isTrustedForwarder(address):(bool)",
      [ethereum.Value.fromAddress(forwarder)]
    );

    return result[0].toBoolean();
  }

  try_isTrustedForwarder(forwarder: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isTrustedForwarder",
      "isTrustedForwarder(address):(bool)",
      [ethereum.Value.fromAddress(forwarder)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  onERC721Received(
    param0: Address,
    param1: Address,
    tokenId: BigInt,
    param3: Bytes
  ): Bytes {
    let result = super.call(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromBytes(param3)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC721Received(
    param0: Address,
    param1: Address,
    tokenId: BigInt,
    param3: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromBytes(param3)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  ownerOf(tokenId: BigInt): Address {
    let result = super.call("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toAddress();
  }

  try_ownerOf(tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  tileIsGorblinified(param0: BigInt): boolean {
    let result = super.call(
      "tileIsGorblinified",
      "tileIsGorblinified(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toBoolean();
  }

  try_tileIsGorblinified(param0: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "tileIsGorblinified",
      "tileIsGorblinified(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  tilePrice(param0: BigInt): BigInt {
    let result = super.call("tilePrice", "tilePrice(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBigInt();
  }

  try_tilePrice(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("tilePrice", "tilePrice(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  tokenURI(tokenId: BigInt): string {
    let result = super.call("tokenURI", "tokenURI(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toString();
  }

  try_tokenURI(tokenId: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("tokenURI", "tokenURI(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  versionRecipient(): string {
    let result = super.call(
      "versionRecipient",
      "versionRecipient():(string)",
      []
    );

    return result[0].toString();
  }

  try_versionRecipient(): ethereum.CallResult<string> {
    let result = super.tryCall(
      "versionRecipient",
      "versionRecipient():(string)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get trustedForwarderAddress_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }
}

export class CreateSeedCall extends ethereum.Call {
  get inputs(): CreateSeedCall__Inputs {
    return new CreateSeedCall__Inputs(this);
  }

  get outputs(): CreateSeedCall__Outputs {
    return new CreateSeedCall__Outputs(this);
  }
}

export class CreateSeedCall__Inputs {
  _call: CreateSeedCall;

  constructor(call: CreateSeedCall) {
    this._call = call;
  }

  get x(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get y(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class CreateSeedCall__Outputs {
  _call: CreateSeedCall;

  constructor(call: CreateSeedCall) {
    this._call = call;
  }
}

export class CreateTileCall extends ethereum.Call {
  get inputs(): CreateTileCall__Inputs {
    return new CreateTileCall__Inputs(this);
  }

  get outputs(): CreateTileCall__Outputs {
    return new CreateTileCall__Outputs(this);
  }
}

export class CreateTileCall__Inputs {
  _call: CreateTileCall;

  constructor(call: CreateTileCall) {
    this._call = call;
  }

  get x(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get y(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get pixels(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class CreateTileCall__Outputs {
  _call: CreateTileCall;

  constructor(call: CreateTileCall) {
    this._call = call;
  }
}

export class GorblinInviteCall extends ethereum.Call {
  get inputs(): GorblinInviteCall__Inputs {
    return new GorblinInviteCall__Inputs(this);
  }

  get outputs(): GorblinInviteCall__Outputs {
    return new GorblinInviteCall__Outputs(this);
  }
}

export class GorblinInviteCall__Inputs {
  _call: GorblinInviteCall;

  constructor(call: GorblinInviteCall) {
    this._call = call;
  }

  get inviteX(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get inviteY(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get secret(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class GorblinInviteCall__Outputs {
  _call: GorblinInviteCall;

  constructor(call: GorblinInviteCall) {
    this._call = call;
  }
}

export class GrantCall extends ethereum.Call {
  get inputs(): GrantCall__Inputs {
    return new GrantCall__Inputs(this);
  }

  get outputs(): GrantCall__Outputs {
    return new GrantCall__Outputs(this);
  }
}

export class GrantCall__Inputs {
  _call: GrantCall;

  constructor(call: GrantCall) {
    this._call = call;
  }

  get canvasId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get inviterTokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get pin(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class GrantCall__Outputs {
  _call: GrantCall;

  constructor(call: GrantCall) {
    this._call = call;
  }
}

export class InviteNeighborCall extends ethereum.Call {
  get inputs(): InviteNeighborCall__Inputs {
    return new InviteNeighborCall__Inputs(this);
  }

  get outputs(): InviteNeighborCall__Outputs {
    return new InviteNeighborCall__Outputs(this);
  }
}

export class InviteNeighborCall__Inputs {
  _call: InviteNeighborCall;

  constructor(call: InviteNeighborCall) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get inviteX(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get inviteY(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get secret(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class InviteNeighborCall__Outputs {
  _call: InviteNeighborCall;

  constructor(call: InviteNeighborCall) {
    this._call = call;
  }
}

export class OnERC721ReceivedCall extends ethereum.Call {
  get inputs(): OnERC721ReceivedCall__Inputs {
    return new OnERC721ReceivedCall__Inputs(this);
  }

  get outputs(): OnERC721ReceivedCall__Outputs {
    return new OnERC721ReceivedCall__Outputs(this);
  }
}

export class OnERC721ReceivedCall__Inputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get value3(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OnERC721ReceivedCall__Outputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class OwnerWithdrawCall extends ethereum.Call {
  get inputs(): OwnerWithdrawCall__Inputs {
    return new OwnerWithdrawCall__Inputs(this);
  }

  get outputs(): OwnerWithdrawCall__Outputs {
    return new OwnerWithdrawCall__Outputs(this);
  }
}

export class OwnerWithdrawCall__Inputs {
  _call: OwnerWithdrawCall;

  constructor(call: OwnerWithdrawCall) {
    this._call = call;
  }
}

export class OwnerWithdrawCall__Outputs {
  _call: OwnerWithdrawCall;

  constructor(call: OwnerWithdrawCall) {
    this._call = call;
  }
}

export class PurchaseTileCall extends ethereum.Call {
  get inputs(): PurchaseTileCall__Inputs {
    return new PurchaseTileCall__Inputs(this);
  }

  get outputs(): PurchaseTileCall__Outputs {
    return new PurchaseTileCall__Outputs(this);
  }
}

export class PurchaseTileCall__Inputs {
  _call: PurchaseTileCall;

  constructor(call: PurchaseTileCall) {
    this._call = call;
  }

  get x(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get y(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class PurchaseTileCall__Outputs {
  _call: PurchaseTileCall;

  constructor(call: PurchaseTileCall) {
    this._call = call;
  }
}

export class RecirculateTileCall extends ethereum.Call {
  get inputs(): RecirculateTileCall__Inputs {
    return new RecirculateTileCall__Inputs(this);
  }

  get outputs(): RecirculateTileCall__Outputs {
    return new RecirculateTileCall__Outputs(this);
  }
}

export class RecirculateTileCall__Inputs {
  _call: RecirculateTileCall;

  constructor(call: RecirculateTileCall) {
    this._call = call;
  }

  get x(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get y(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RecirculateTileCall__Outputs {
  _call: RecirculateTileCall;

  constructor(call: RecirculateTileCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class ResetTileCall extends ethereum.Call {
  get inputs(): ResetTileCall__Inputs {
    return new ResetTileCall__Inputs(this);
  }

  get outputs(): ResetTileCall__Outputs {
    return new ResetTileCall__Outputs(this);
  }
}

export class ResetTileCall__Inputs {
  _call: ResetTileCall;

  constructor(call: ResetTileCall) {
    this._call = call;
  }

  get x(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get y(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ResetTileCall__Outputs {
  _call: ResetTileCall;

  constructor(call: ResetTileCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends ethereum.Call {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SafeTransferFrom1Call extends ethereum.Call {
  get inputs(): SafeTransferFrom1Call__Inputs {
    return new SafeTransferFrom1Call__Inputs(this);
  }

  get outputs(): SafeTransferFrom1Call__Outputs {
    return new SafeTransferFrom1Call__Outputs(this);
  }
}

export class SafeTransferFrom1Call__Inputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class SafeTransferFrom1Call__Outputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class SetForwarderCall extends ethereum.Call {
  get inputs(): SetForwarderCall__Inputs {
    return new SetForwarderCall__Inputs(this);
  }

  get outputs(): SetForwarderCall__Outputs {
    return new SetForwarderCall__Outputs(this);
  }
}

export class SetForwarderCall__Inputs {
  _call: SetForwarderCall;

  constructor(call: SetForwarderCall) {
    this._call = call;
  }

  get trustedForwarder_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetForwarderCall__Outputs {
  _call: SetForwarderCall;

  constructor(call: SetForwarderCall) {
    this._call = call;
  }
}

export class SetRendererCall extends ethereum.Call {
  get inputs(): SetRendererCall__Inputs {
    return new SetRendererCall__Inputs(this);
  }

  get outputs(): SetRendererCall__Outputs {
    return new SetRendererCall__Outputs(this);
  }
}

export class SetRendererCall__Inputs {
  _call: SetRendererCall;

  constructor(call: SetRendererCall) {
    this._call = call;
  }

  get addr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetRendererCall__Outputs {
  _call: SetRendererCall;

  constructor(call: SetRendererCall) {
    this._call = call;
  }
}

export class SetTilePriceCall extends ethereum.Call {
  get inputs(): SetTilePriceCall__Inputs {
    return new SetTilePriceCall__Inputs(this);
  }

  get outputs(): SetTilePriceCall__Outputs {
    return new SetTilePriceCall__Outputs(this);
  }
}

export class SetTilePriceCall__Inputs {
  _call: SetTilePriceCall;

  constructor(call: SetTilePriceCall) {
    this._call = call;
  }

  get x(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get y(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get price(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SetTilePriceCall__Outputs {
  _call: SetTilePriceCall;

  constructor(call: SetTilePriceCall) {
    this._call = call;
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

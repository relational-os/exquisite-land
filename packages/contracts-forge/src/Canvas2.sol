/*
   ⋅.         ████████╗███████╗██████╗░██████╗░░█████╗░
              ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗
              ░░░██║░░░█████╗░░██████╔╝██████╔╝███████║
              ░░░██║░░░██╔══╝░░██╔══██╗██╔══██╗██╔══██║
              ░░░██║░░░███████╗██║░░██║██║░░██║██║░░██║
              ░░░╚═╝░░░╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝

                ███╗░░░███╗░█████╗░░██████╗██╗░░░██╗
                ████╗░████║██╔══██╗██╔════╝██║░░░██║
                ██╔████╔██║███████║╚█████╗░██║░░░██║
                ██║╚██╔╝██║██╔══██║░╚═══██╗██║░░░██║
                ██║░╚═╝░██║██║░░██║██████╔╝╚██████╔╝
                ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░░╚═════╝░

    ▄▀█ █▄░█   █▀▀ ▀▄▀ █▀█ █░█ █ █▀ █ ▀█▀ █▀▀   █░░ ▄▀█ █▄░█ █▀▄
    █▀█ █░▀█   ██▄ █░█ ▀▀█ █▄█ █ ▄█ █ ░█░ ██▄   █▄▄ █▀█ █░▀█ █▄▀    .⋅ 
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './utils/TrustedForwarderRecipient.sol';
import './interfaces/IRender.sol';
import './interfaces/IFont.sol';
import { IExquisiteGraphics } from "./interfaces/IExquisiteGraphics.sol";
import "@sstore2/contracts/SSTORE2.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract Canvas2 is
  ERC721,
  Ownable,
  TrustedForwarderRecipient,
  IERC721Receiver
{
  // * External Dependencies *//
  IExquisiteGraphics gfx = IExquisiteGraphics(payable(0xDf01A4040493B514605392620B3a0a05Eb8Cd295));

  // * Constants * //
  uint8 constant MAX_SEEDS_PER_CANVAS = 4; // 4? proportional to slime?
  uint8 constant MAX_CANVAS_WIDTH = 16;
  uint8 constant MAX_CANVAS_HEIGHT = 16;
  uint8 constant MAX_TILE_WIDTH = 32;
  uint8 constant MAX_TILE_HEIGHT = 32;
  uint8 constant NUM_COLORS = 16;
  // seed canvas (tile) address
  // seed canvas (tile) x,y/tokenId

  // * Addresses * //
  event InviteCoinCreated(uint256 tokenId);
  event InviteCoinUsed(uint256 tokenId, address recipient, address coinCreator);
  event TileGorblinified(uint256 tokenId);
  event SeedCreated(uint256 tokenId, address recipient);
  event NeighborInvited(uint256 tokenId, address recipient);
  event TileCreated(uint256 tokenId, address sender);
  event TileReset(uint256 tokenId);


  // * SVG Presets * //
  // https://lospec.com/palette-list/bubblegum-16
  bytes public PALETTE = hex"16171a7f0622d62411ff8426ffd100fafdffff80a4ff267494216a43006723497568aed4bfff3c10d275007899002859";
  bytes public XQST_HEADER = hex"012020000f000000";

  // prettier-ignore
  string[32] public LOOKUP=["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

  mapping(bytes32 => bool) public inviteSecrets;
  mapping(uint256 => bool) public tileIsGorblinified;
  mapping(uint256 => uint256) public tilePrice;

  // * Canvas Data Storage * //
  mapping(uint256 => address) public _svgData;
  mapping(uint256 => bool) private _tileFilled;
  mapping(uint256 => uint256) private _lastTransferred;
  mapping(uint256 => address) private _coinCreator;
  uint8 private _seedCount;

  // * Modifiers * //
  function _validateTile(uint256 x, uint256 y) internal pure {
    require(
      x < MAX_CANVAS_WIDTH && x >= 0,
      'You are out of horizontal bounds.'
    );
    require(y < MAX_CANVAS_HEIGHT && y >= 0, 'You are out of vertical bounds');
  }

  modifier isValidTile(uint256 x, uint256 y) {
    _validateTile(x, y);
    _;
  }

  // * Constructor * //
  constructor(
    address trustedForwarderAddress_
  )
    ERC721('Exquisite Land', 'XQST')
    TrustedForwarderRecipient(trustedForwarderAddress_)
  {
    gfx = IExquisiteGraphics(payable(0xDf01A4040493B514605392620B3a0a05Eb8Cd295));
  }

  // * Tile Creation Methods * //
  // todo: specify seed recipient address? 
  function createSeed(uint256 x, uint256 y)
    public
    onlyOwner
    isValidTile(x, y)
  {
    require(_seedCount < MAX_SEEDS_PER_CANVAS, 'Max seeds per canvas reached');
    uint256 tokenId = generateTokenID(x, y);
    _safeMint(_msgSender(), tokenId);
    _seedCount++;
    emit SeedCreated(tokenId, _msgSender());
  }

  // function setCoinCreator(uint256 tokenId, address coinCreator) public {
  //   require(
  //     msg.sender == _landGranter,
  //     'Only the LandGranter can set the Coin Creator'
  //   );
  //   require(
  //     _coinCreator[tokenId] == address(0),
  //     'Coin Creator already exists for this token'
  //   );
  //   _coinCreator[tokenId] = coinCreator;
  // }

  function inviteNeighbor(
    uint256 tokenId,
    uint256 inviteX,
    uint256 inviteY,
    bytes32 secret
  ) public {
    require(
      ownerOf(tokenId) == _msgSender(),
      'You are not the owner of that tile.'
    );
    (uint256 senderX, uint256 senderY) = getCoordinates(tokenId);
    uint256 targetTileId = generateTokenID(inviteX, inviteY);
    require(!_exists(targetTileId), 'Requested tile is already taken.');
    require(
      inviteIsValid(senderX, senderY, inviteX, inviteY),
      'Target tile is not a neighbor.'
    );
    emit NeighborInvited(targetTileId, _msgSender());
    inviteSecrets[secret] = true;
  }

  function gorblinInvite(
    uint256 inviteX,
    uint256 inviteY,
    bytes32 secret
  ) public
    onlyOwner {
    resetTile(inviteX, inviteY);
    uint256 targetTileId = generateTokenID(inviteX, inviteY);
    inviteSecrets[secret] = true;
    tileIsGorblinified[targetTileId] = true;
    emit TileGorblinified(targetTileId);
  }

  function createTile(
    uint256 x,
    uint256 y,
    bytes calldata pixels
  ) public isValidTile(x, y) {
    require(pixels.length == 1024, 'Data is not 1024 bytes');
    uint256 tokenId = generateTokenID(x, y);
    require(
      ownerOf(tokenId) == _msgSender(),
      'You are not the owner of this tile'
    );
    require(_tileFilled[tokenId] == false, 'Someone already drew that tile.');

    _svgData[tokenId] = SSTORE2.write(pixels);
    _tileFilled[tokenId] = true;
    emit TileCreated(tokenId, _msgSender());
  }

  // * Helper methods * //
  function inviteIsValid(
    uint256 senderX,
    uint256 senderY,
    uint256 inviteX,
    uint256 inviteY
  ) public pure returns (bool) {
    bool checkWest;
    if (inviteX > 0)
      checkWest = ((senderX == inviteX - 1) && (senderY == inviteY));
    else checkWest = false;
    bool checkEast = ((senderX == inviteX + 1) && (senderY == inviteY));
    bool checkSouth;
    if (inviteY > 0)
      checkSouth = ((senderY == inviteY - 1) && (senderX == inviteX));
    else checkSouth = false;
    bool checkNorth = ((senderY == inviteY + 1) && (senderX == inviteX));
    return (checkWest || checkEast || checkSouth || checkNorth);
  }

  function getTileSVG(uint256 tokenId) public view returns (string memory) {
    return gfx.draw(
        abi.encodePacked(XQST_HEADER, PALETTE, SSTORE2.read(_svgData[tokenId]))
    );
  }

  function generateTokenID(uint256 x, uint256 y)
    public
    pure
    isValidTile(x, y)
    returns (uint256)
  {
    return (x << 8) | y;
  }

  function getCoordinates(uint256 tokenId) public pure returns (uint256, uint256) {
    uint256 x = (tokenId & (0x0000FF00)) >> 8;
    uint256 y = (tokenId & (0x000000FF));
    require(
      x < MAX_CANVAS_WIDTH && x >= 0,
      'Tile is out of horizontal bounds.'
    );
    require(y < MAX_CANVAS_HEIGHT && y >= 0, 'Tile is out of vertical bounds.');
    return (x, y);
  }

  function _validateTransfer(uint256 tokenId, address to) private view {
    /* Prevent a user from inviting themselves to the board as a neighbor */
    (uint256 x, uint256 y) = getCoordinates(uint256(tokenId));
    if (to != address(0)) {
      // check east is in bounds
      if (x < MAX_CANVAS_WIDTH - 1) {
        uint256 id = generateTokenID(x + 1, y);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on east bound check'
        );
      }

      // check west is in bounds
      if (x > 0) {
        uint256 id = generateTokenID(x - 1, y);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on west bound check'
        );
      }

      // check south is in bounds
      if (y < MAX_CANVAS_HEIGHT - 1) {
        uint256 id = generateTokenID(x, y + 1);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on south bound check'
        );
      }

      // check north is in bounds
      if (y > 0) {
        uint256 id = generateTokenID(x, y - 1);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on north bound check'
        );
      }
    }
  }

  // * Tile Buy Buy * //

  function setTilePrice(uint256 x, uint256 y, uint256 price) public onlyOwner {
    uint256 id = generateTokenID(x, y);
    require(!_exists(id), "Someone owns that");
    tilePrice[id] = price;
  }

  function purchaseTile(uint256 x, uint256 y) external payable {
    uint256 id = generateTokenID(x, y);
    require(!_exists(id), "Someone owns that");
    require(msg.value == tilePrice[id], "Not enough ether");
    _safeMint(_msgSender(), id);
  }

  function ownerWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
  }

  // * Admin Only Methods * //

  function setRenderer(address addr) public onlyOwner {
    gfx = IExquisiteGraphics(payable(addr));
    // _renderer = IRender(addr);
  }

  function resetTile(uint256 x, uint256 y) public onlyOwner isValidTile(x, y) {
    uint256 tokenId = generateTokenID(x, y);

    delete _svgData[tokenId];
    delete _coinCreator[tokenId];
    delete _tileFilled[tokenId];
    _burn(tokenId);
    emit TileReset(tokenId);
  }

  function recirculateTile(uint256 x, uint256 y)
    public
    onlyOwner
    isValidTile(x, y)
  {
    uint256 tokenId = generateTokenID(x, y);
    require(block.timestamp > _lastTransferred[tokenId] + 12 hours);
    resetTile(x, y);
  }

  function onERC721Received(
    address,
    address,
    uint256 tokenId,
    bytes memory
  ) public override returns (bytes4) {
    require(
      ownerOf(tokenId) == address(this),
      'Not owner of token'
    );
    emit InviteCoinCreated(tokenId);
    return this.onERC721Received.selector;
  }

  function grant(uint256 canvasId, uint256 tokenId, uint256 inviterTokenId, bytes8 pin) public {
    bytes32 secret = keccak256(abi.encodePacked(uint16(canvasId), uint16(tokenId), uint16(inviterTokenId), pin));
    require(inviteSecrets[secret], 'Invalid invite');
    require(!_exists(tokenId), 'Tile already exists');
    _safeMint(_msgSender(), tokenId);
  }

  // * ERC721 Overrides * //
  function tokenURI(uint256 tokenId)
    public
    view
    override
    returns (string memory)
  {
    (uint256 x, uint256 y) = getCoordinates(tokenId);
    string memory output;
    string memory description;

    if (_tileFilled[tokenId]) {
      output = 'data:image/svg+xml;base64,';
      output = string(
        abi.encodePacked(
          output,
          Base64.encode(abi.encodePacked(getTileSVG(tokenId)))
        )
      );
      description = string(
        abi.encodePacked('"Terra Masu Tile [', LOOKUP[x], ',', LOOKUP[y], ']"')
      );
    } else {
      description = '"A blank Terra Masu Tile"';
      output = 'ipfs://QmTWDxdiwJuP1ZcCMcvXyimwwFQ8GFHhVUmJCgRkzDxxmL';
    }

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "Terra Masu Tile [',
            LOOKUP[x],
            ',',
            LOOKUP[y],
            ']", "description": ',
            description,
            ', "image": "',
            output,
            '"}'
          )
        )
      )
    );
    output = string(abi.encodePacked('data:application/json;base64,', json));
    return output;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, tokenId);
    // Ensure the token isn't being transferred to someone who owns a neighboring tile already
    _validateTransfer(tokenId, to);
    _lastTransferred[tokenId] = block.timestamp;
  }

  // * Overrides for Context / Trusted Forwarder * //
  function _msgSender()
    internal
    view
    override(Context, TrustedForwarderRecipient)
    returns (address)
  {
    return super._msgSender();
  }

  function _msgData()
    internal
    view
    override(Context, TrustedForwarderRecipient)
    returns (bytes memory ret)
  {
    return super._msgData();
  }
}

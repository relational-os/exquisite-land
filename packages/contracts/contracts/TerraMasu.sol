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
import '@openzeppelin/contracts/access/Ownable.sol';
import './utils/TrustedForwarderRecipient.sol';
import './interfaces/IRender.sol';
import './interfaces/IBase64.sol';
import './interfaces/IExquisiteLand.sol';
import './interfaces/IFont.sol';

contract TerraMasu is
  IExquisiteLand,
  ERC721,
  Ownable,
  TrustedForwarderRecipient
{
  // * External Dependencies *//
  IRender private _renderer;
  IBase64 private _b64;

  // * Constants * //
  uint8 constant MAX_SEEDS_PER_CANVAS = 5;
  uint8 constant MAX_CANVAS_WIDTH = 16;
  uint8 constant MAX_CANVAS_HEIGHT = 16;
  uint8 constant MAX_TILE_WIDTH = 32;
  uint8 constant MAX_TILE_HEIGHT = 32;
  uint8 constant NUM_COLORS = 16;

  // * Addresses * //
  address private _landGranter;

  // * SVG Presets * //
  string[16] PALETTE = [
    '#e4a672',
    '#b86f50',
    '#743f39',
    '#3f2832',
    '#9e2835',
    '#e53b44',
    '#fb922b',
    '#ffe762',
    '#63c64d',
    '#327345',
    '#193d3f',
    '#4f6781',
    '#afbfd2',
    '#ffffff',
    '#2ce8f4',
    '#0484d1'
  ];

  // prettier-ignore
  string[32] public LOOKUP=["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

  // * Default Coin Data *//
  string DEFAULT_COIN_OPENER =
    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><style>.small{font:8px serif;fill:#e68d3e}</style><circle id="coin" cx="50" cy="50" r="45" fill="#F5CB53"/><circle id="coin2" cx="50" cy="50" r="37" fill="transparent"/><path id="lowerhalf" d="M10 50a25 25 0 0 0 80 0" fill="transparent"/><text class="small"><textPath href="#lowerhalf" startOffset="32%">exquisite.land</textPath></text><text class="small"><textPath href="#coin2" startOffset="65%">play it forward</textPath></text><text x="50%" y="50%" text-anchor="middle" class="small">[';
  string DEFAULT_COIN_CLOSER = ']</text></svg>';
  // * Canvas Data Storage * //
  mapping(uint32 => bytes) private _svgData;
  mapping(uint32 => bool) private _tileFilled;
  mapping(uint32 => uint256) private _lastTransferred;
  mapping(uint32 => address) private _coinCreator;
  uint8 private _seedCount;

  // * Modifiers * //
  modifier isInitialized() {
    require(_landGranter != address(0), 'Not initialized');
    // require(_renderer != address(0), "Not initialized");
    _;
  }

  function _validateTile(uint32 x, uint32 y) internal pure {
    require(
      x < MAX_CANVAS_WIDTH && x >= 0,
      'You are out of horizontal bounds.'
    );
    require(y < MAX_CANVAS_HEIGHT && y >= 0, 'You are out of vertical bounds');
  }

  modifier isValidTile(uint32 x, uint32 y) {
    _validateTile(x, y);
    _;
  }

  // * Constructor * //
  constructor(
    address trustedForwarderAddress_,
    address rendererAddress_,
    address b64Address_
  )
    ERC721('Exquisite Land', 'XQST')
    TrustedForwarderRecipient(trustedForwarderAddress_)
  {
    _renderer = IRender(rendererAddress_);
    _b64 = IBase64(b64Address_);
  }

  // * Tile Creation Methods * //
  function createSeed(uint32 x, uint32 y)
    public
    onlyOwner
    isInitialized
    isValidTile(x, y)
  {
    require(_seedCount < MAX_SEEDS_PER_CANVAS, 'Max seeds per canvas reached');
    uint32 tokenId = generateTokenID(x, y);
    _safeMint(_landGranter, tokenId);
    _seedCount++;
    emit SeedCreated(tokenId, _landGranter);
  }

  function setCoinCreator(uint32 tokenId, address coinCreator) public {
    require(
      msg.sender == _landGranter,
      'Only the LandGranter can set the Coin Creator'
    );
    require(
      _coinCreator[tokenId] == address(0),
      'Coin Creator already exists for this token'
    );
    _coinCreator[tokenId] = coinCreator;
  }

  function inviteNeighbor(
    uint32 tokenId,
    uint32 inviteX,
    uint32 inviteY,
    address recipient
  ) public {
    require(
      ownerOf(tokenId) == _msgSender(),
      'You are not the owner of that tile.'
    );
    (uint32 senderX, uint32 senderY) = getCoordinates(tokenId);
    uint32 targetTileId = generateTokenID(inviteX, inviteY);
    require(!_exists(targetTileId), 'Requested tile is already taken.');
    require(
      inviteIsValid(senderX, senderY, inviteX, inviteY),
      'Target tile is not a neighbor.'
    );
    _safeMint(recipient, targetTileId);
    emit NeighborInvited(targetTileId, recipient);
  }

  function createTile(
    uint32 x,
    uint32 y,
    bytes calldata pixels
  ) public isValidTile(x, y) {
    require(pixels.length == 1024, 'Data is not 1024 bytes');
    uint32 tokenId = generateTokenID(x, y);
    require(
      ownerOf(tokenId) == _msgSender(),
      'You are not the owner of this tile'
    );
    require(_tileFilled[tokenId] == false, 'Someone already drew that tile.');

    _svgData[tokenId] = pixels;
    _tileFilled[tokenId] = true;
    emit TileCreated(tokenId, _msgSender());
  }

  // * Helper methods * //
  function inviteIsValid(
    uint32 senderX,
    uint32 senderY,
    uint32 inviteX,
    uint32 inviteY
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

  function getTileSVG(uint32 tokenId) public view returns (string memory) {
    string[] memory palette = new string[](16);

    for (uint8 i; i < PALETTE.length; i++) palette[i] = PALETTE[i];

    return
      _renderer.renderSVG(
        _svgData[uint32(tokenId)],
        palette,
        MAX_TILE_WIDTH,
        MAX_TILE_HEIGHT
      );
  }

  function generateTokenID(uint32 x, uint32 y)
    public
    pure
    isValidTile(x, y)
    returns (uint32)
  {
    return (x << 8) | y;
  }

  function getCoordinates(uint32 tokenId) public pure returns (uint32, uint32) {
    uint32 x = (tokenId & (0x0000FF00)) >> 8;
    uint32 y = (tokenId & (0x000000FF));
    require(
      x < MAX_CANVAS_WIDTH && x >= 0,
      'Tile is out of horizontal bounds.'
    );
    require(y < MAX_CANVAS_HEIGHT && y >= 0, 'Tile is out of vertical bounds.');
    return (x, y);
  }

  function _validateTransfer(uint256 tokenId, address to) private view {
    /* Prevent a user from inviting themselves to the board as a neighbor */
    (uint32 x, uint32 y) = getCoordinates(uint32(tokenId));
    if (to != address(0) && to != _landGranter) {
      // check east is in bounds
      if (x < MAX_CANVAS_WIDTH - 1) {
        uint32 id = generateTokenID(x + 1, y);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on east bound check'
        );
      }

      // check west is in bounds
      if (x > 0) {
        uint32 id = generateTokenID(x - 1, y);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on west bound check'
        );
      }

      // check south is in bounds
      if (y < MAX_CANVAS_HEIGHT - 1) {
        uint32 id = generateTokenID(x, y + 1);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on south bound check'
        );
      }

      // check north is in bounds
      if (y > 0) {
        uint32 id = generateTokenID(x, y - 1);
        require(
          !_exists(id) || ownerOf(id) != to,
          'failed on north bound check'
        );
      }
    }
  }

  // * Admin Only Methods * //
  function setLandGranter(address granter) public onlyOwner {
    _landGranter = granter;
  }

  function setRenderer(address addr) public onlyOwner {
    _renderer = IRender(addr);
  }

  function resetTile(uint32 x, uint32 y) public onlyOwner isValidTile(x, y) {
    uint32 tokenId = generateTokenID(x, y);
    require(ownerOf(tokenId) != address(0) && ownerOf(tokenId) != _landGranter);

    delete _svgData[tokenId];
    delete _coinCreator[tokenId];
    delete _tileFilled[tokenId];
    _transfer(ownerOf(tokenId), _landGranter, tokenId);
    emit TileReset(tokenId);
  }

  function recirculateTile(uint32 x, uint32 y)
    public
    onlyOwner
    isValidTile(x, y)
  {
    uint32 tokenId = generateTokenID(x, y);
    require(block.timestamp > _lastTransferred[tokenId] + 12 hours);
    resetTile(x, y);
  }

  // * ERC721 Overrides * //
  function tokenURI(uint256 tokenId)
    public
    view
    override
    returns (string memory)
  {
    (uint32 x, uint32 y) = getCoordinates(uint32(tokenId));
    string memory output;
    string memory description;

    if (_tileFilled[uint32(tokenId)]) {
      output = getTileSVG(uint32(tokenId));
      description = string(
        abi.encodePacked('"Terra Masu Tile [', LOOKUP[x], ',', LOOKUP[y], ']"')
      );
    } else {
      output = string(
        abi.encodePacked(
          DEFAULT_COIN_OPENER,
          LOOKUP[x],
          ',',
          LOOKUP[y],
          DEFAULT_COIN_CLOSER
        )
      );
      description = '"A blank Terra Masu Tile"';
    }

    string memory json = _b64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "Exquisite Land Tile [',
            LOOKUP[x],
            ',',
            LOOKUP[y],
            ']", "description": ',
            description,
            ', "image": "data:image/svg+xml;base64,',
            _b64.encode(bytes(output)),
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
    _lastTransferred[uint32(tokenId)] = block.timestamp;
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

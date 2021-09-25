// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/TrustedForwarderRecipient.sol";
import "./interfaces/IRender.sol";

contract ExquisiteLand is ERC721, Ownable, TrustedForwarderRecipient {
    // * External Dependencies *//
    IRender private _renderer;

    // * Constants * //
    uint8 constant MAX_SEEDS_PER_CANVAS = 4;
    uint8 constant MAX_CANVAS_WIDTH = 32;
    uint8 constant MAX_CANVAS_HEIGHT = 32;
    uint8 constant MAX_TILE_WIDTH = 32;
    uint8 constant MAX_TILE_HEIGHT = 32;
    // uint8 constant MAX_TILE_PIXELS = 1024;

    // * Addresses * //
    address private _landGranter;

    // * Admin controls * //
    bool allowEditing = true;

    // * SVG Presets * //
    string[16] PALETTE = [
        "#e4a672",
        "#b86f50",
        "#743f39",
        "#3f2832",
        "#9e2835",
        "#e53b44",
        "#fb922b",
        "#ffe762",
        "#63c64d",
        "#327345",
        "#193d3f",
        "#4f6781",
        "#afbfd2",
        "#ffffff",
        "#2ce8f4",
        "#0484d1"
    ];

    // * Canvas Data Storage * //
    mapping(uint32 => bytes) private _svgData;
    uint32[4] private _seeds;

    // * Event definitions * //
    event SeedCreated(uint32 tokenId, address recipient);
    event NeighborInvited(uint32 tokenId, address recipient);
    event TileCreated(uint32 tokenId, address sender);

    // * Modifiers * //
    modifier isInitialized() {
        require(_landGranter != address(0), "Not initialized");
        // require(_renderer != address(0), "Not initialized");
        _;
    }

    modifier isValidTile(uint32 x, uint32 y) {
        require(
            x < MAX_CANVAS_WIDTH && x >= 0,
            "You are out of horizontal bounds."
        );
        require(
            y < MAX_CANVAS_HEIGHT && y >= 0,
            "You are out of vertical bounds"
        );
        _;
    }

    // * Constructor * //
    constructor(address trustedForwarderAddress_)
        ERC721("Exquisite Land", "XQST")
        TrustedForwarderRecipient(trustedForwarderAddress_)
    {
        _renderer = IRender(0x1A1FeD25762a9DEA62F31074A2680DD5BB714c94);
    }

    // * Tile Creation Methods * //
    function createSeed(uint32 x, uint32 y)
        public
        onlyOwner
        isInitialized
        isValidTile(x, y)
    {
        uint32 tokenId = generateTokenID(x, y);
        // require(seedNearExistingSeeds(tokenId), "Seed is too far from other seeds.")
        for (uint32 i = 0; i < MAX_SEEDS_PER_CANVAS; i++) {
            if (_seeds[i] == 0) {
                _seeds[i] = tokenId;
                _safeMint(_landGranter, tokenId);
                emit SeedCreated(tokenId, _landGranter);
                return;
            }
        }
    }

    function inviteNeighbor(
        uint32 tokenId,
        uint32 inviteX,
        uint32 inviteY,
        address recipient
    ) public {
        require(
            ownerOf(tokenId) == _msgSender(),
            "You are not the owner of that tile."
        );
        (uint32 senderX, uint32 senderY) = getCoordinates(tokenId);
        uint32 targetTileId = generateTokenID(inviteX, inviteY);
        require(!_exists(targetTileId), "Requested tile is already taken.");
        require(
            inviteIsValid(senderX, senderY, inviteX, inviteY),
            "Target tile is not a neighbor."
        );
        _safeMint(recipient, targetTileId);
        emit NeighborInvited(targetTileId, recipient);
    }

    function createTile(
        uint32 x,
        uint32 y,
        bytes calldata pixels
    ) public isValidTile(x, y) {
        require(pixels.length == 512, "Data is not 512 bytes");
        uint32 tokenId = generateTokenID(x, y);
        require(ownerOf(tokenId) == _msgSender(), "u r not owner rawr");
        require(
            allowEditing || targetTileIsBlank(tokenId),
            "Someone already drew that tile."
        );
        _svgData[tokenId] = pixels;
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

    function targetTileIsBlank(uint32 tokenId) public view returns (bool) {
        return true;
    }

    function getTileSVG(uint32 tokenId) public view returns (string memory) {
        return _renderer.renderSVG(_svgData[uint32(tokenId)], PALETTE);
    }

    function generateTokenID(uint32 x, uint32 y)
        public
        pure
        isValidTile(x, y)
        returns (uint32)
    {
        return (x << 8) | y;
    }

    function getCoordinates(uint32 tokenId)
        public
        pure
        returns (uint32, uint32)
    {
        uint32 x = (tokenId & (0x0000FF00)) >> 8;
        uint32 y = (tokenId & (0x000000FF));
        require(
            x < MAX_CANVAS_WIDTH && x >= 0,
            "Tile is out of horizontal bounds."
        );
        require(
            y < MAX_CANVAS_HEIGHT && y >= 0,
            "Tile is out of vertical bounds."
        );
        return (x, y);
    }

    function toggleAllowEditing() public onlyOwner {
        allowEditing = !allowEditing;
    }

    // * Public Read Methods * //
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        (uint32 x, uint32 y) = getCoordinates(uint32(tokenId));

        string memory output = _renderer.renderSVG(
            _svgData[uint32(tokenId)],
            PALETTE
        );
        // prettier-ignore
        string[32] memory LOOKUP=["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

        // TODO lookup again
        string memory json = string(
            abi.encodePacked(
                '{"name": "Exquisite Land Tile ',
                LOOKUP[x],
                " ",
                LOOKUP[y],
                '", "description": "Blank for now", "image": "data:image/svg+xml;utf-8,',
                output,
                '"}'
            )
        );
        output = string(abi.encodePacked("data:application/json;utf-8,", json));
        return output;
    }

    // * Admin Only Methods * //
    function setLandGranter(address granter) public onlyOwner {
        _landGranter = granter;
    }

    function setRenderer(address addr) public onlyOwner {
        _renderer = IRender(addr);
    }

    function _msgSender()
        internal
        view
        override(Context, TrustedForwarderRecipient)
        returns (address)
    {
        return TrustedForwarderRecipient._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, TrustedForwarderRecipient)
        returns (bytes memory ret)
    {
        return TrustedForwarderRecipient._msgData();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Tile is ERC721, Ownable {
    uint8 constant MAX_CANVASES = 16;
    uint8 constant MAX_SEEDS_PER_CANVAS = 4;
    uint8 constant MAX_WIDTH = 100;
    uint8 constant MAX_HEIGHT = 100;

    string[][MAX_CANVASES] PALLETES = [
        ["#000", "akdlsjf;lak", "asdfasdf", "asdfas", "aaa"],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""],
        ["#000", "", "", "", ""]
    ];

    mapping(uint8 => string) public canvasNames;
    mapping(uint32 => string) public svgData;

    modifier validTile(
        uint32 canvasId,
        uint32 x,
        uint32 y
    ) {
        require(canvasId < MAX_CANVASES && canvasId >= 0);
        require(x < MAX_WIDTH && x >= 0);
        require(y < MAX_HEIGHT && y >= 0);
        _;
    }

    constructor() ERC721("Tile", "TILE") {}

    function createSeed(
        uint32 canvasId,
        uint32 x,
        uint32 y
    ) public onlyOwner validTile(canvasId, x, y) {
        uint32 tokenId = generateTokenID(canvasId, x, y);
        _safeMint(msg.sender, tokenId);
    }

    function createTile(
        uint32 canvasId,
        uint32 x,
        uint32 y,
        string memory _svgData
    ) public validTile(canvasId, x, y) {
        uint32 tokenId = generateTokenID(canvasId, x, y);
        require(ownerOf(tokenId) == msg.sender);
        svgData[tokenId] = _svgData;

        // figure out neighbors and mint those if possible
        if (y > 0) {
            uint32 north = generateTokenID(canvasId, x, y - 1);
            if (ownerOf(north) == address(0)) _safeMint(msg.sender, north);
        }
        if (y < MAX_HEIGHT) {
            uint32 south = generateTokenID(canvasId, x, y + 1);
            if (ownerOf(south) == address(0)) _safeMint(msg.sender, south);
        }
        if (x > 0) {
            uint32 west = generateTokenID(canvasId, x - 1, y);
            if (ownerOf(west) == address(0)) _safeMint(msg.sender, west);
        }
        if (x < MAX_WIDTH) {
            uint32 east = generateTokenID(canvasId, x + 1, y);
            if (ownerOf(east) == address(0)) _safeMint(msg.sender, east);
        }
    }

    function generateTokenID(
        uint32 canvasId,
        uint32 x,
        uint32 y
    ) public pure validTile(canvasId, x, y) returns (uint32) {
        return (canvasId << 16) | (x << 8) | y;
    }

    function getCoordinates(uint32 tokenId)
        public
        pure
        returns (
            uint32,
            uint32,
            uint32
        )
    {
        uint32 canvasId = tokenId >> 16;
        uint32 x = (tokenId & (0x0000FF00)) >> 8;
        uint32 y = (tokenId & (0x000000FF));

        require(canvasId < MAX_CANVASES && canvasId >= 0);
        require(x < MAX_WIDTH && x >= 0);
        require(y < MAX_HEIGHT && y >= 0);

        return (canvasId, x, y);
    }

    function getPallete(uint32 canvasId) public view returns (string[] memory) {
        require(canvasId < MAX_CANVASES);
        return PALLETES[canvasId];
    }
}

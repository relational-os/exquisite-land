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

    struct TilePathStroke { 
       uint32 strokeColor;
       uint32 strokeWidth;
       uint256[2][] paths;
    }
    
      struct TileDataContainer { 
          mapping(uint => TilePathStroke) strokes;
          bool isLocked;
          uint strokeCount;
      }
    
    bool allowEditing = true;

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

    mapping(uint32 => string) public canvasNames;
    mapping(uint32 => TileDataContainer) public svgData;
    mapping(uint32 => uint32[4]) seeds;

    modifier validTile(
        uint32 canvasId,
        uint32 x,
        uint32 y
    ) {
        require(canvasId < MAX_CANVASES && canvasId >= 0);
        require(x < MAX_WIDTH && x >= 0, "You are out of horizontal bounds.");
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
        // require(seedNearExistingSeeds(tokenId), "Seed is too far from other seeds.")
        
        for (uint32 i = 0; i < MAX_SEEDS_PER_CANVAS; i++) { 
            if (seeds[canvasId][i] == 0) {
                seeds[canvasId][i] = tokenId;
                _safeMint(msg.sender, tokenId);
                return;
            }
        }
    }
    
    function inviteNeighbor(uint32 tokenId, uint32 inviteX, uint32 inviteY, address recipient) public {
        require(ownerOf(tokenId) == msg.sender);
        uint32 canvasId;
        uint32 senderX;
        uint32 senderY;
        (canvasId, senderX, senderY) = getCoordinates(tokenId);
        
        uint32 targetTileId = generateTokenID(canvasId, inviteX, inviteY);
        
        require(ownerOf(targetTileId) == address(0), "Requested tile is already taken.");
        require((senderX == inviteX - 1 && senderY == inviteY) || (senderX == inviteX + 1 && senderY == inviteY) || (senderY == inviteY - 1 && senderX == inviteX) || (senderY == inviteY + 1 && senderX == inviteX), "Requested tile is not a neighbor.");
        
        _safeMint(recipient, targetTileId);
    }
    
    function targetTileIsBlank(uint32 tokenId) public view returns (bool) {
        return !svgData[tokenId].isLocked;
    }

    function createTile(
        uint32 canvasId,
        uint32 x,
        uint32 y,
        TilePathStroke[] calldata strokes
    ) public validTile(canvasId, x, y) {
        uint32 tokenId = generateTokenID(canvasId, x, y);
        require(ownerOf(tokenId) == msg.sender);
        require(allowEditing || targetTileIsBlank(tokenId), "Someone already drew that tile.");    
        
        for (uint32 i = 0; i < strokes.length; i++) {
            svgData[tokenId].strokes[i] = strokes[i];
        }
        
        svgData[tokenId].isLocked = true;
        svgData[tokenId].strokeCount = strokes.length;
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
    
    function toggleAllowEditing() public onlyOwner {
        allowEditing = !allowEditing;
    }
    
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        string memory outputSvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 600000 600000" >';
        
        TileDataContainer data = svgData[tokenId];
        for (uint32 i = 0; i < data.strokeCount; i++) {
            outputSvg = abi.encodePacked(outputSvg, )
        } 
    }

}

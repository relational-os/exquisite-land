// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tile is ERC721, Ownable {
    uint8 constant MAX_CANVASES = 16;
    uint8 constant MAX_SEEDS_PER_CANVAS = 4;
    uint8 constant MAX_WIDTH = 100;
    uint8 constant MAX_HEIGHT = 100;
    uint8 constant MAX_COLORS = 5;
    uint8 constant MAX_BRUSH_SIZES = 2;

    struct TilePathStroke {
        uint32 strokeColor;
        uint32 strokeWidth;
        string path;
    }

    struct TileDataContainer {
        mapping(uint256 => TilePathStroke) strokes;
        bool isLocked;
        uint256 strokeCount;
    }

    bool allowEditing = true;

    string[][MAX_CANVASES] PALETTES = [
        ["#000", "#23577a", "#38a3a4", "#57cc99", "#7fed99", "#c7f9cc"],
        ["#000", "#cdb4db", "#ffc8dd", "#ffafcd", "#bde0fd", "#a2d2ff"],
        ["#000", "#79addc", "#ffbf9f", "#ffee92", "#fcf5c7", "#aef7b6"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"],
        ["#000", "#", "#", "#", "#", "#"]
    ];

    uint8[2] BRUSH_SIZES = [4, 16];

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

    event SeedCreated(uint32 tokenId, address recipient);
    event NeighborInvited(uint32 tokenId, address recipient);
    event TileCreated(uint32 tokenId, address sender);

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
                emit SeedCreated(tokenId, msg.sender);
                return;
            }
        }
    }
    
    function inviteIsValid(
        uint32 senderX,
        uint32 senderY,
        uint32 inviteX,
        uint32 inviteY
        ) public pure returns (bool) {
            bool checkWest;
            
            if (inviteX > 0) {
                checkWest = ((senderX == inviteX - 1) && (senderY == inviteY));
            } else {
                checkWest = false;
            }
            
            bool checkEast = ((senderX == inviteX + 1) && (senderY == inviteY));
            
            bool checkSouth;
            
            if (inviteY > 0) {
              checkSouth = ((senderY == inviteY - 1) && (senderX == inviteX));  
            } else {
                checkSouth = false;
            }
            
            bool checkNorth = ((senderY == inviteY + 1) && (senderX == inviteX));
            
            return (checkWest || checkEast || checkSouth || checkNorth);
        }


    function inviteNeighbor(
        uint32 tokenId,
        uint32 inviteX,
        uint32 inviteY,
        address recipient
    ) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of that tile.");
        uint32 canvasId;
        uint32 senderX;
        uint32 senderY;
        (canvasId, senderX, senderY) = getCoordinates(tokenId);

        uint32 targetTileId = generateTokenID(canvasId, inviteX, inviteY);

        require(
            !_exists(targetTileId),
            "Requested tile is already taken."
        );
        
        require(inviteIsValid(senderX, senderY, inviteX, inviteY), "Target tile is not a neighbor.");

        _safeMint(recipient, targetTileId);
        emit NeighborInvited(targetTileId, recipient);
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
        require(
            allowEditing || targetTileIsBlank(tokenId),
            "Someone already drew that tile."
        );

        for (uint32 i = 0; i < strokes.length; i++) {
            svgData[tokenId].strokes[i] = strokes[i];
        }

        svgData[tokenId].isLocked = true;
        svgData[tokenId].strokeCount = strokes.length;

        emit TileCreated(tokenId, msg.sender);
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

        require(canvasId < MAX_CANVASES && canvasId >= 0, "Canvas ID out of accepted range.");
        require(x < MAX_WIDTH && x >= 0, "Tile is out of horizontal bounds.");
        require(y < MAX_HEIGHT && y >= 0, "Tile is out of vertical bounds.");

        return (canvasId, x, y);
    }

    function getPalette(uint32 canvasId) public view returns (string[] memory) {
        require(canvasId < MAX_CANVASES);
        return PALETTES[canvasId];
    }

    function toggleAllowEditing() public onlyOwner {
        allowEditing = !allowEditing;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        (uint32 canvasId, uint32 x, uint32 y) = getCoordinates(uint32(tokenId));
        string memory output = getTileSVG(canvasId);
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Canvas #',
                        toString(canvasId),
                        " ",
                        toString(x),
                        " ",
                        toString(y),
                        '", "description": "Blank for now", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function getTileSVG(uint32 tokenId) public view returns (string memory) {
        TileDataContainer storage data = svgData[uint32(tokenId)];
        (uint32 canvasId, uint32 x, uint32 y) = getCoordinates(uint32(tokenId));
        string
            memory output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 600 600" >';
        for (uint32 i = 1; i < data.strokeCount + 1; i++) {
            string memory strokePath = data.strokes[i - 1].path;
            require(
                data.strokes[i - 1].strokeColor >= 0 &&
                    data.strokes[i - 1].strokeColor < MAX_COLORS,
                "Stroke color out of range"
            );
            string memory strokeColor = PALETTES[canvasId][
                data.strokes[i - 1].strokeColor
            ];
            require(
                data.strokes[i - 1].strokeWidth >= 0 &&
                    data.strokes[i - 1].strokeWidth < MAX_BRUSH_SIZES,
                "Stroke color out of range"
            );
            uint8 strokeWidth = BRUSH_SIZES[data.strokes[i - 1].strokeWidth];
            output = string(
                abi.encodePacked(
                    output,
                    '<path d="',
                    strokePath,
                    '" fill="none" stroke-linecap="round" stroke="',
                    strokeColor,
                    '" stroke-width="',
                    toString(strokeWidth),
                    '"></path>'
                )
            );
        }
        output = string(abi.encodePacked(output, "</svg>"));
        return output;
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(input, 0x3F))), 0xFF)
                )
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}

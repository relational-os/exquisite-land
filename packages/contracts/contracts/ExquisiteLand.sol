// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExquisiteLand is ERC721, Ownable {
    // * Constants * //
    uint8 constant MAX_CANVASES = 16;
    uint8 constant MAX_SEEDS_PER_CANVAS = 4;
    uint8 constant MAX_CANVAS_WIDTH = 100;
    uint8 constant MAX_CANVAS_HEIGHT = 100;
    uint8 constant MAX_TILE_WIDTH = 32;
    uint8 constant MAX_TILE_HEIGHT = 32;
    // uint8 constant MAX_TILE_PIXELS = 1024;
    uint8 constant MAX_COLORS = 16;
    uint8 constant MAX_BRUSH_SIZES = 2;

    // * Addresses * //
    address private _landGranter;

    // * Struct definitions * //
    struct TileDataContainer {
        uint8[1024] pixels;
        bool isLocked;
    }

    // * Admin controls * //
    bool allowEditing = true;

    // * SVG Presets * //
    string[MAX_COLORS] PALETTE = [
        "e4a672",
        "b86f50",
        "743f39",
        "3f2832",
        "9e2835",
        "e53b44",
        "fb922b",
        "ffe762",
        "63c64d",
        "327345",
        "193d3f",
        "4f6781",
        "afbfd2",
        "ffffff",
        "2ce8f4",
        "0484d1"
    ];

    uint8[2] BRUSH_SIZES = [4, 16];

    // * Canvas Data Storage * //
    mapping(uint32 => string) public canvasNames;
    mapping(uint32 => TileDataContainer) private _svgData;
    mapping(uint32 => uint32[4]) seeds;

    // * Event definitions * //
    event SeedCreated(uint32 tokenId, address recipient);
    event NeighborInvited(uint32 tokenId, address recipient);
    event TileCreated(uint32 tokenId, address sender);

    // * Modifiers * //
    modifier isInitialized() {
        // require(_landGranter != address(0), "Not initialized");
        _;
    }
    modifier isValidTile(
        uint32 canvasId,
        uint32 x,
        uint32 y
    ) {
        require(canvasId < MAX_CANVASES && canvasId >= 0, "not a valid canvas");
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
    constructor() ERC721("Exquisite Land", "TILE") {}

    // * Tile Creation Methods * //
    function createSeed(
        uint32 canvasId,
        uint32 x,
        uint32 y
    ) public onlyOwner isInitialized isValidTile(canvasId, x, y) {
        uint32 tokenId = generateTokenID(canvasId, x, y);
        // require(seedNearExistingSeeds(tokenId), "Seed is too far from other seeds.")
        for (uint32 i = 0; i < MAX_SEEDS_PER_CANVAS; i++) {
            if (seeds[canvasId][i] == 0) {
                seeds[canvasId][i] = tokenId;
                // _safeMint(_landGranter, tokenId);
                _safeMint(msg.sender, tokenId);
                emit SeedCreated(tokenId, msg.sender);
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
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of that tile."
        );
        (uint32 canvasId, uint32 senderX, uint32 senderY) = getCoordinates(
            tokenId
        );
        uint32 targetTileId = generateTokenID(canvasId, inviteX, inviteY);
        require(!_exists(targetTileId), "Requested tile is already taken.");
        require(
            inviteIsValid(senderX, senderY, inviteX, inviteY),
            "Target tile is not a neighbor."
        );
        _safeMint(recipient, targetTileId);
        emit NeighborInvited(targetTileId, recipient);
    }

    function createTile(
        uint32 canvasId,
        uint32 x,
        uint32 y,
        uint8[1024] calldata pixels
    ) public isValidTile(canvasId, x, y) {
        uint32 tokenId = generateTokenID(canvasId, x, y);
        require(ownerOf(tokenId) == msg.sender, "u r not owner rawr");
        require(
            allowEditing || targetTileIsBlank(tokenId),
            "Someone already drew that tile."
        );

        _svgData[tokenId].pixels = pixels;
        _svgData[tokenId].isLocked = true;

        emit TileCreated(tokenId, msg.sender);
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
        return !_svgData[tokenId].isLocked;
    }

    function generateTokenID(
        uint32 canvasId,
        uint32 x,
        uint32 y
    ) public pure isValidTile(canvasId, x, y) returns (uint32) {
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

        require(
            canvasId < MAX_CANVASES && canvasId >= 0,
            "Canvas ID out of accepted range."
        );
        require(
            x < MAX_CANVAS_WIDTH && x >= 0,
            "Tile is out of horizontal bounds."
        );
        require(
            y < MAX_CANVAS_HEIGHT && y >= 0,
            "Tile is out of vertical bounds."
        );

        return (canvasId, x, y);
    }

    // * Admin Only Methods * //
    function setLandGranter(address granter) public onlyOwner {
        _landGranter = granter;
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
        TileDataContainer storage data = _svgData[uint32(tokenId)];
        (uint32 canvasId, uint32 x, uint32 y) = getCoordinates(uint32(tokenId));
        string
            memory output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 32 32" >';

        for (uint8 y = 0; y < 16; y++) {
            for (uint8 x = 0; x < 16; x++) {
                output = string(
                    abi.encodePacked(
                        output,
                        '<rect x="',
                        toString(x),
                        '" y="',
                        toString(y),
                        '"  style="fill:#B0B0B0',
                        // PALETTE[data.pixels[x + y * MAX_TILE_HEIGHT]],
                        '" width="1" height="1"/>'
                    )
                );
            }
        }

        output = string(abi.encodePacked(output, "</svg>"));
        return output;
    }

    // * Other Helpers * //
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

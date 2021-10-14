// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IExquisiteLand {
  // * Event definitions * //
  event SeedCreated(uint32 tokenId, address recipient);
  event NeighborInvited(uint32 tokenId, address recipient);
  event TileCreated(uint32 tokenId, address sender);
  event TileReset(uint32 tokenId);

  // * Functions * //
  function createSeed(uint32 x, uint32 y) external;

  function inviteNeighbor(
    uint32 tokenId,
    uint32 inviteX,
    uint32 inviteY,
    address recipient
  ) external;

  function createTile(
    uint32 x,
    uint32 y,
    bytes calldata pixels
  ) external;

  /// * Helper functions * //
  function inviteIsValid(
    uint32 senderX,
    uint32 senderY,
    uint32 inviteX,
    uint32 inviteY
  ) external pure returns (bool);

  function getTileSVG(uint32 tokenId) external view returns (string memory);

  function generateTokenID(uint32 x, uint32 y) external pure returns (uint32);

  function getCoordinates(uint32 tokenId)
    external
    pure
    returns (uint32, uint32);

  // * Admin only functions * //
  function setLandGranter(address granter) external;

  function setRenderer(address addr) external;

  function resetTile(uint32 x, uint32 y) external;

  function recirculateTile(uint32 x, uint32 y) external;
}

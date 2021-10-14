// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ILandGranter {
  function grant(uint256 tokenId, address recipient) external;
}

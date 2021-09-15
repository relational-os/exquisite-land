// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

interface ILandGranter {
    function grant(uint256 tokenId, address recipient) external;
}

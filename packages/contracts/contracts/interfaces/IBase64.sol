// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IBase64 {
    function encode(bytes memory data) external pure returns (string memory);
}

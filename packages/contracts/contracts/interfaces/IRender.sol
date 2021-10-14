// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRender {
  function renderSVG(bytes memory data, string[16] memory palette)
    external
    pure
    returns (string memory);
}

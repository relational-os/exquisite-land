// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRender {
  function renderSVG(
    bytes calldata data,
    string[] calldata palette,
    uint16 num_rows,
    uint16 num_cols
  ) external view returns (string memory);
}

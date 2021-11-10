// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// See https://etherscan.io/address/0x0812306fbeca6f808476db083e850d6f7a7f941d#readContract for implementation

interface IFont {
  function getFont() external view returns (string memory);
}

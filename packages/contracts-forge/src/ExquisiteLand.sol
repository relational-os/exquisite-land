/*
   _________________________________________
 / \                                        \.
|   |   ██   ██  ██████  ███████ ████████   |.
 \_ |    ██ ██  ██    ██ ██         ██      |.
    |     ███   ██    ██ ███████    ██      |.
    |    ██ ██  ██ ▄▄ ██      ██    ██      |.
    |   ██   ██  ██████  ███████    ██      |.
    |               ▀▀                      |.
    |                                       |.
    |   ██       █████  ███    ██ ██████    |.
    |   ██      ██   ██ ████   ██ ██   ██   |.
    |   ██      ███████ ██ ██  ██ ██   ██   |.
    |   ██      ██   ██ ██  ██ ██ ██   ██   |.
    |   ███████ ██   ██ ██   ████ ██████    |.
    |                                       |.
    |  _____________________________________|___
    \_/___________ A RELATIONAL GAME __________/.

*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import '@openzeppelin/contracts/access/Ownable.sol';

contract ExquisiteLand is Ownable {
  // * STORAGE * //
  uint256 public constant MAX_CANVASES = 12;
  mapping(uint256 => address) public lands;
  address public credits;

  // * ADMIN FUNCTIONS * //
  function registerLand(uint256 landId, address addr) public onlyOwner {
    require(lands[landId] == address(0), 'Land already registered');
    require(landId < MAX_CANVASES, 'Land id out of range');
    lands[landId] = addr;
  }

  function registerCredits(address addr) public onlyOwner {
    require(credits == address(0), 'Credits already registered');
    credits = addr;
  }
}

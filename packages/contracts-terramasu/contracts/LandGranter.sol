// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/ILandGranter.sol';
import './interfaces/IExquisiteLand.sol';

contract LandGranter is ILandGranter, IERC721Receiver, Ownable {
  IExquisiteLand private _exquisiteLand;

  event InviteCoinCreated(uint256 tokenId);
  event InviteCoinUsed(uint256 tokenId, address recipient, address coinCreator);

  constructor(address exquisiteLandAddress) {
    _exquisiteLand = IExquisiteLand(exquisiteLandAddress);
  }

  function onERC721Received(
    address,
    address,
    uint256 tokenId,
    bytes memory
  ) public override returns (bytes4) {
    require(
      _exquisiteLand.ownerOf(tokenId) == address(this),
      'Not owner of token'
    );
    emit InviteCoinCreated(tokenId);
    return this.onERC721Received.selector;
  }

  function grant(
    uint256 tokenId,
    address recipient,
    address coinCreator
  ) public override onlyOwner {
    require(
      _exquisiteLand.ownerOf(tokenId) == address(this),
      "I don't have this token."
    );
    _exquisiteLand.safeTransferFrom(address(this), recipient, tokenId);
    _exquisiteLand.setCoinCreator(uint32(tokenId), coinCreator);
    emit InviteCoinUsed(tokenId, recipient, coinCreator);
  }
}

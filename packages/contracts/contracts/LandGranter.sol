// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandGranter is ERC721Holder, Ownable {
    IERC721 private _exquisiteLand;

    event LandGranted(uint256 tokenId, address recipient);

    constructor(address exquisiteLandAddress) {
        _exquisiteLand = IERC721(exquisiteLandAddress);
    }

    function grant(uint256 tokenId, address recipient) public onlyOwner {
        require(
            _exquisiteLand.ownerOf(tokenId) == address(this),
            "I don't have this token."
        );
        _exquisiteLand.safeTransferFrom(address(this), recipient, tokenId);
        emit LandGranted(tokenId, recipient);
    }
}

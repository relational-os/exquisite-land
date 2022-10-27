// questions
// - should it support more than 1 canvas? benefit of making it super-generic? 
// -> probably just one-off, simple -- single voting period
// - voting open/close or self-track time? 
// - how to calculate address:slime amounts? on-contract vs graph
    // tileId:address:amount

// startVoting(int days)
    // -> contract handles voting period

// TODO:
// openVote() ownerOnly
// closeVote() ownerOnly

// SLIME_POOLS = {tileId: slimeAmount, ... }


// voting period concludes
    // burn the slime? pending more design jam

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISlime.sol";

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";


contract SlimePools is ERC2771Context, Ownable {
    address public slimeAddress;
    mapping(uint32 => uint256) public slimePools;
    uint32 public mostSlimed;

    event SlimePooled(uint32 tokenId, uint256 amount, address from);

    constructor(address slimeAddress_, MinimalForwarder forwarder) 
        ERC2771Context(address(forwarder)) {
        slimeAddress = slimeAddress_;
    }

    function setSlimeAddress(address slimeAddress_) external onlyOwner {
        slimeAddress = slimeAddress_;
    }

    function getCoordinates(uint32 tokenId) public pure returns (uint32, uint32) {
        uint32 x = (tokenId & (0x0000FF00)) >> 8;
        uint32 y = (tokenId & (0x000000FF));
        return (x, y);
    }

    function poolSlime(uint32 tokenId, uint32 slimeAmount) public {
        // console.log("poolSlime %s %s", tokenId, slimeAmount);

        // confirm transfer?
        ISlime(slimeAddress).transfer(
            _msgSender(), // TODO: check w TrustedForwarder
            address(this),
            uint256(slimeAmount)
        );

        slimePools[tokenId] += slimeAmount;
        emit SlimePooled(tokenId, slimeAmount, _msgSender());

        if (slimePools[mostSlimed] < slimePools[tokenId]) {
            mostSlimed = tokenId;
        }
    }


    function _msgSender() internal view override(Context, ERC2771Context) returns(address) {
        return ERC2771Context._msgSender();
    } 

    function _msgData() internal view override(Context, ERC2771Context) returns(bytes memory) 
    {
        return ERC2771Context._msgData();
}  

}



// create slime -> admin only function to mint directly into wallets
    // merkle tree style vs manual 
    // claim from uploaded merkle root granted slime + wallet

// initial airdrop

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
// import "./utils/TrustedForwarderRecipient.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

// https://polygonscan.com/address/0x7dacD1e6b4097bBAE0F2fDf4DFc09092D80b5b69#code

contract Slime is ERC20, ERC20Burnable, Ownable { //, TrustedForwarderRecipient {
    error NotAnAdmin();

    modifier onlyAdmin () {
        if (_msgSender() != owner() && !administrators[_msgSender()]) {
            revert NotAnAdmin();
        }
        _;
    }

    mapping (address => bool) private administrators;

    // constructor(address forwarderAddress)
    constructor()
        ERC20("Slime", "SLIME")
        // TrustedForwarderRecipient(forwarderAddress)
    {}

    // ** ADMIN MGMNT ** //
    function setAdmin(address _newAdmin, bool _isAdmin) external onlyOwner {
        administrators[_newAdmin] = _isAdmin;
    }

    function isAdmin(address _addr) external view returns (bool) {
        return administrators[_addr];
    }

    // ** MINT & BURN ** //
    function mint(address to, uint256 amount) public onlyAdmin {
        _mint(to, amount);
    }

    function bulkMint(address[] memory addresses, uint[] memory amounts) public payable onlyAdmin {
        for(uint i; i < addresses.length; i++) {
            _mint(addresses[i], amounts[i]);
        }
    }

    // The following functions are overrides required by Solidity.
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20)
    {
        super._burn(account, amount);
    }

    // we want to inherit from TrustedForwarder, not Context
//     function _msgSender()
//         internal
//         view
//         override(Context, TrustedForwarderRecipient)
//         returns (address)
//     {
//         return TrustedForwarderRecipient._msgSender();
//     }

//     function _msgData()
//         internal
//         view
//         override(Context, TrustedForwarderRecipient)
//         returns (bytes memory ret)
//     {
//         return TrustedForwarderRecipient._msgData();
//     }

}
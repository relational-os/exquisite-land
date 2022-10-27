pragma solidity ^0.8.13;

interface ISlime {
    function burn(address from, uint256 amount) external;
    function transfer(address from, address to, uint256 amount) external;
}

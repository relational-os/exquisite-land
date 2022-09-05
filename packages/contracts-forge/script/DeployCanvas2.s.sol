// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {Solenv} from "solenv/Solenv.sol";
import {Canvas2} from "../src/Canvas2.sol";

contract DeployCanvas2 is Script {
    // Deployable contracts
    Canvas2 public canvas2contract;

    function run() public {
        // Deployment config from .env.local file
        Solenv.config(".env.local");

        vm.startBroadcast();
        canvas2contract = new Canvas2(address(0xE079E12A7A5809A98Ff2822d8f17bD060aDd5EA1));

        vm.stopBroadcast();
    }
}
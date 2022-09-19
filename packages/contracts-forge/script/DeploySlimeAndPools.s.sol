// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {Solenv} from "solenv/Solenv.sol";
import {SlimePools} from "../src/SlimePools.sol";
import {Slime} from "../src/Slime.sol";

contract DeploySlimeAndPools is Script {
    // Deployable contracts
    SlimePools public slimePoolsContract;
    Slime public slimeContract;

    function run() public {
        // Deployment config from .env.local file
        Solenv.config(".env.local");
        vm.startBroadcast();

        slimeContract = new Slime();
        slimePoolsContract = new SlimePools(address(slimeContract));

        vm.stopBroadcast();
    }
}
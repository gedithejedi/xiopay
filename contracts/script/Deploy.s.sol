// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DeployAll, DeployParams} from "./dependency/DeployAll.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        DeployAll.deploy(DeployParams({usdxInitialSupply: 1000000}));

        vm.stopBroadcast();
    }
}

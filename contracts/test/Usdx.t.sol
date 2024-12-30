// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {DeployAll, DeployParams, DeployInstance} from "script/dependency/DeployAll.sol";
import {IXDP} from "src/interfaces/IXDP.sol";
import {IUsdx} from "src/interfaces/IUsdx.sol";

contract UsdxTest is Test {
    IUsdx usdx;
    address alice = address(0x1);

    function setUp() public {
        DeployInstance memory instance = DeployAll.deploy(DeployParams({usdxInitialSupply: 100}));
        usdx = IUsdx(instance.usdx);
    }

    function testFaucet() public {
        assertEq(usdx.balanceOf(alice), 0, "Alice should have 0 USDX");

        vm.startPrank(alice);
        usdx.faucet();
        assertEq(usdx.balanceOf(alice), 10 ether, "Alice should have 10 USDX");
    }
}

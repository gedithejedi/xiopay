// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.0;

import {Usdx} from "src/Usdx.sol";
import {XDP} from "src/XDP.sol";

struct DeployParams {
    uint256 usdxInitialSupply;
}

struct DeployInstance {
    address usdx;
    address xdp;
}

library DeployAll {
    function deploy(DeployParams memory params) internal returns (DeployInstance memory instance) {
        instance.usdx = address(new Usdx(params.usdxInitialSupply));
        instance.xdp = address(new XDP(instance.usdx));
    }
}

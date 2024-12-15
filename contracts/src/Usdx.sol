// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Usdx is ERC20, ERC20Permit {
    constructor(uint256 initialSupply) ERC20("USDX Stablecoin", "USDX") ERC20Permit("USDX Stablecoin") {
        _mint(msg.sender, initialSupply);
    }
}

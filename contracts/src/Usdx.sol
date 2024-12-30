// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

// @attention This is a mock stablecoin for testing purpose and demo. This is not for production.
contract Usdx is ERC20, ERC20Permit {
    constructor(uint256 initialSupply) ERC20("USDX Stablecoin", "USDX") ERC20Permit("USDX Stablecoin") {
        _mint(msg.sender, initialSupply);
    }

    // @dev Faucet function is not recommended for production.
    function faucet() external {
        _mint(msg.sender, 10 ether);
    }
}

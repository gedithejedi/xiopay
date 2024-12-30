// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

interface IUsdx is IERC20, IERC20Permit {
    // Custom methods unique to IUsdx
    /// @dev Allows users to mint a small number of tokens for testing/demonstration.
    function faucet() external;
}

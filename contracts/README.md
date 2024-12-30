# Xio pay

This project contains 
- XDP.sol: stands for `Xio Donation Protocol`, this act as main contract for the protocol
- Usdx.sol: This supposed to be usd pegged token. This mock stable token is used for development purpose.
  
## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test -vvv --fork-url neo_x_test
$ forge test -vvv --fork-url neo_x
```

### Format

```shell
$ forge fmt
```

### Deploy

```shell
$ forge script script/Deploy.s.sol:DeployScript --fork-url neo_x_test
$ forge script script/Deploy.s.sol:DeployScript --fork-url neo_x
```

#### Deploy with broadcast

- Deploy on neo x testnet and verify contract
```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url $TESTNET_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --verifier blockscout --verifier-url $TESTNET_BLOCK_SCOUT_API_KEY
```
- Deploy on neo x mainnet and verify contract
```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url $MAINNET_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --verifier blockscout --verifier-url $MAINNET_BLOCK_SCOUT_API_KEY
```


### Environment variable
- `PRIVATE_KEY`: Deployer wallet private key
- `TESTNET_RPC_URL`: (optional) Neo X testnet RPC url
- `MAINNET_RPC_URL`: Neo X mainnet RPC url
- `TESTNET_BLOCK_SCOUT_API_KEY`: (optional) Neo X testnet block scout api url
- `MAINNET_BLOCK_SCOUT_API_KEY`: (optional) Neo X mainnet block scout api url

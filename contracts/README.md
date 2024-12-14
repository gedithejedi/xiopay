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
```

#### Deploy with broadcast
```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url $TESTNET_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --verifier blockscout --verifier-url $TESTNET_BLOCK_SCOUT_API_KEY
```

### Environment variable
- `PRIVATE_KEY`: Deployer wallet private key
- `TESTNET_RPC_URL`
- `MAINNET_RPC_URL`
- `TESTNET_BLOCK_SCOUT_API_KEY`
- `MAINNET_BLOCK_SCOUT_API_KEY`

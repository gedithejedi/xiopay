import { Chain, defineChain, fallback, http } from 'viem'
import { sepolia } from 'viem/chains'
import { createConfig } from 'wagmi'

export const neoXTestnet = /*#__PURE__*/ defineChain({
  id: 12227332,
  name: 'NeoX T4',
  nativeCurrency: { name: 'GAS', symbol: 'GAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['testnet.rpc.banelabs.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'xt4scan.ngd.network',
    },
  },
  testnet: true,
})

export const neoXMainnet = /*#__PURE__*/ defineChain({
  id: 47763,
  name: 'NeoX',
  nativeCurrency: { name: 'GAS', symbol: 'GAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet-2.rpc.banelabs.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://xexplorer.neo.org/',
    },
  },
})

export const chains: readonly [Chain, ...Chain[]] = [neoXTestnet, neoXMainnet]

export const wagmiProviderConfig = createConfig({
  chains,
  transports: {
    [neoXTestnet.id]: fallback([http()]),
    [neoXMainnet.id]: fallback([http()]),
  },
})

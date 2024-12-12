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

export const chains: readonly [Chain, ...Chain[]] = [sepolia, neoXTestnet]

export const wagmiProviderConfig = createConfig({
  chains,
  transports: {
    [sepolia.id]: fallback([http()]),
    [neoXTestnet.id]: fallback([http()]),
  },
})

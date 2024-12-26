import { Chain, http } from 'viem'
import { createConfig } from 'wagmi'
import { neoxMainnet, neoxT4 } from 'viem/chains'
import { Chain as ChainI } from '@/app/lib/chains'

export const chainIdToViemChain = (chainId: number): Chain | undefined => {
  switch (chainId) {
    case ChainI.NEOX_TESTNET:
      return neoxT4 as Chain
    case ChainI.NEOX:
      return neoxMainnet as Chain
    default:
      return undefined
  }
}

export const chains: readonly [Chain, ...Chain[]] = [
  neoxT4 as Chain,
  // neoXMainnet,
  // sepolia,
]

export const wagmiProviderConfig = createConfig({
  chains,
  multiInjectedProviderDiscovery: false,
  transports: {
    batch: true,
    [neoxT4.id]: http(),
    // [neoXMainnet.id]: fallback([
    //   http('https://mainnet-2.rpc.banelabs.org'),
    //   http(),
    // ]),
    // [sepolia.id]: fallback([http()]),
  },
})

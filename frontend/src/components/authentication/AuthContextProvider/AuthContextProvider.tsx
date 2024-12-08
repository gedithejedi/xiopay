'use client'

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import {
  DynamicContextProvider,
  mergeNetworks,
} from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'

import {
  DefaultOptions,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { AuthContextProviderProps } from './AuthContextProvider.type'

import { wagmiProviderConfig } from '@/lib/chains'
import { useState } from 'react'

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  },
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false)

  // const router = useRouter()

  // const onAuthSuccess: OnAuthSuccess = async (args) => {
  //   const dynamicUserId = args.user.userId

  //   setIsLoading(true)

  //   if (dynamicUserId) {
  //     const data = await getUser({ dynamicUserId })

  //     if (data.status === 404) {
  //       try {
  //         await postUser({ dynamicUserId })
  //         await queryClient.invalidateQueries({ queryKey: ['user'] })
  //       } catch (err) {
  //         toast.error('Something went wrong')
  //         await args.handleLogOut()
  //       }
  //     }
  //   }

  //   setIsLoading(false)
  // }

  // const onLogout = async () => {
  //   setIsLoading(true)

  //   const isPublic = unaunthenticatedRoutes.some((route) =>
  //     new RegExp(`^${route}(?:#.*)?$`).test(router.asPath)
  //   )

  //   if (!isPublic) {
  //     await router.push(Routes.root)
  //   }

  //   setIsLoading(false)
  // }

  const evmNetworks = [
    {
      blockExplorerUrls: ['xt4scan.ngd.network'],
      chainId: '12227332',
      chainName: 'Neo X Testnet T4',
      iconUrls: ['https://neo-web.azureedge.net/images/logo%20files-dark.svg'],
      name: 'Neo X Testnet T4',
      nativeCurrency: {
        decimals: 18,
        name: 'GAS',
        symbol: 'GAS',
      },
      networkId: '12227332',
      rpcUrls: ['testnet.rpc.banelabs.org'],
      vanityName: 'Taiko',
      shortName: 'GAS',
      chain: 'GAS',
    },
  ]

  return (
    <DynamicContextProvider
      settings={{
        recommendedWallets: [{ walletKey: 'metamask' }],
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!,
        walletConnectors: [EthereumWalletConnectors],
        walletConnectPreferredChains: [`eip155:324`],
        overrides: {
          evmNetworks: (networks) => {
            return mergeNetworks(networks, evmNetworks)
          },
        },
        eventsCallbacks: {
          // onAuthSuccess,
          // onLogout,
        },
      }}
    >
      <WagmiProvider config={wagmiProviderConfig}>
        <QueryClientProvider client={queryClient}>
          {
            <DynamicWagmiConnector suppressChainMismatchError>
              {isLoading ? <p>Loading..</p> : children}
            </DynamicWagmiConnector>
          }
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}

export default AuthContextProvider

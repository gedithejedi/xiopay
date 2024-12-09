'use client'

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import {
  DynamicContextProvider,
  mergeNetworks,
  OnAuthSuccess,
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
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

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

  const router = useRouter()
  const pathname = usePathname()

  const onAuthSuccess: OnAuthSuccess = async ({ isAuthenticated }) => {
    setIsLoading(true)

    if (isAuthenticated) {
      toast.success('Successfully logged in')
      router.push('/dashboard')
    }

    setIsLoading(false)
  }

  const onLogout = () => {
    setIsLoading(true)

    const isDashboard = pathname.startsWith('/dashboard')

    if (isDashboard) {
      router.replace('/')
    }

    setIsLoading(false)
  }

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
          onAuthSuccess,
          onLogout,
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

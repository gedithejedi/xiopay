'use client'

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import {
  DynamicContextProvider,
  mergeNetworks,
  OnAuthSuccess,
  getAuthToken,
} from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'

import {
  DefaultOptions,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { getCsrfToken, signOut } from 'next-auth/react'

import { AuthContextProviderProps } from './AuthContextProvider.type'

import { neoXMainnet, neoXTestnet, wagmiProviderConfig } from '@/lib/chains'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getUser } from '@/utils/user/getUser'
import { postUser } from '@/utils/user/postUser'

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

  const onAuthSuccess: OnAuthSuccess = async (args) => {
    const dynamicUserId = args.user.userId
    const isAuthenticated = args.isAuthenticated
    setIsLoading(true)

    const authToken = getAuthToken()
    if (!authToken) {
      console.error('No auth token found')
      return
    }

    const csrfToken = await getCsrfToken()

    fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `csrfToken=${encodeURIComponent(
        csrfToken
      )}&token=${encodeURIComponent(authToken)}`,
    })
      .then(async (res) => {
        if (res.ok && isAuthenticated) {
          toast.success('Successfully logged in')

          //Dynamic user get/ create from the database
          // if (dynamicUserId) {
          //   const data = await getUser({ dynamicUserId })

          //   if (data.status === 404) {
          //     try {
          //       await postUser({ dynamicUserId })
          //       await queryClient.invalidateQueries({ queryKey: ['user'] })
          //     } catch (err) {
          //       toast.error('Something went wrong')
          //       await args.handleLogOut()
          //     }
          //   }
          // }

          router.push('/dashboard')
        } else {
          toast.error('Something went wrong, please try again!')
          console.error('Failed to log in')
        }
      })
      .catch((error) => {
        // Handle any exceptions
        console.error('Error logging in', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onLogout = async () => {
    setIsLoading(true)

    await signOut({ callbackUrl: 'http://localhost:3000' })
    toast.success('Successfully logged out')

    setIsLoading(false)
  }

  const evmNetworks = [
    {
      blockExplorerUrls: [neoXMainnet.blockExplorers.default.url],
      chainId: neoXMainnet.id,
      chainName: neoXMainnet.name,
      iconUrls: ['https://neo-web.azureedge.net/images/logo%20files-dark.svg'],
      name: neoXMainnet.name,
      nativeCurrency: {
        decimals: neoXMainnet.nativeCurrency.decimals,
        name: neoXMainnet.nativeCurrency.symbol,
        symbol: neoXMainnet.nativeCurrency.symbol,
      },
      networkId: neoXMainnet.id,
      rpcUrls: [neoXMainnet.rpcUrls.default.http[0]],
      vanityName: neoXMainnet.name,
      shortName: neoXMainnet.nativeCurrency.symbol,
      chain: neoXMainnet.nativeCurrency.symbol,
    },
    {
      blockExplorerUrls: [neoXTestnet.blockExplorers.default.url],
      chainId: neoXTestnet.id,
      chainName: neoXTestnet.name,
      iconUrls: ['https://neo-web.azureedge.net/images/logo%20files-dark.svg'],
      name: neoXTestnet.name,
      nativeCurrency: {
        decimals: neoXTestnet.nativeCurrency.decimals,
        name: neoXTestnet.nativeCurrency.symbol,
        symbol: neoXTestnet.nativeCurrency.symbol,
      },
      networkId: neoXTestnet.id,
      rpcUrls: [neoXTestnet.rpcUrls.default.http[0]],
      vanityName: neoXTestnet.name,
      shortName: neoXTestnet.nativeCurrency.symbol,
      chain: neoXTestnet.nativeCurrency.symbol,
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

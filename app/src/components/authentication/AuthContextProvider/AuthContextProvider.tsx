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

import { wagmiProviderConfig } from '@/lib/chains'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import Loading from '@/components/atoms/Loading'
import { neoxT4 } from 'viem/chains'
import { postUser } from '@/utils/user/postUser'
import { getUser } from '@/utils/user/getUser'

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  },
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })

const pathToDisableRedirect = ['/donate']
function shouldRedirect(pathname: string) {
  return pathToDisableRedirect.every((p) => !pathname.startsWith(p))
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

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
          if (dynamicUserId) {
            const data = await getUser({ dynamicUserId })

            if (data.status === 404) {
              try {
                await postUser({ dynamicUserId })
                await queryClient.invalidateQueries({ queryKey: ['user'] })
              } catch {
                toast.error('Something went wrong')
                await args.handleLogOut()
              }
            }
          }

          if (shouldRedirect(pathname)) {
            router.push('/dashboard')
          }
        } else {
          toast.error('Something went wrong, please try again!')
          console.error('Failed to log in')
        }
      })
      .catch((error) => {
        console.error('Error logging in', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onLogout = async () => {
    setIsLoading(true)
    await signOut()
    toast.success('Successfully logged out')
    if (shouldRedirect(pathname)) {
      router.push('/')
    }

    setIsLoading(false)
  }

  const evmNetworks = [
    // {
    //   blockExplorerUrls: [neoXMainnet.blockExplorers.default.url],
    //   chainId: neoXMainnet.id,
    //   chainName: neoXMainnet.name,
    //   iconUrls: ['https://neo-web.azureedge.net/images/logo%20files-dark.svg'],
    //   name: neoXMainnet.name,
    //   nativeCurrency: {
    //     decimals: neoXMainnet.nativeCurrency.decimals,
    //     name: neoXMainnet.nativeCurrency.symbol,
    //     symbol: neoXMainnet.nativeCurrency.symbol,
    //   },
    //   networkId: neoXMainnet.id,
    //   rpcUrls: [neoXMainnet.rpcUrls.default.http[0]],
    //   vanityName: neoXMainnet.name,
    //   shortName: neoXMainnet.nativeCurrency.symbol,
    //   chain: neoXMainnet.nativeCurrency.symbol,
    // },
    {
      blockExplorerUrls: [neoxT4.blockExplorers.default.url],
      chainId: neoxT4.id,
      chainName: neoxT4.name,
      iconUrls: ['https://neo-web.azureedge.net/images/logo%20files-dark.svg'],
      name: neoxT4.name,
      nativeCurrency: {
        decimals: neoxT4.nativeCurrency.decimals,
        name: neoxT4.nativeCurrency.symbol,
        symbol: neoxT4.nativeCurrency.symbol,
      },
      networkId: neoxT4.id,
      rpcUrls: [neoxT4.rpcUrls.default.http[0]],
      vanityName: neoxT4.name,
      shortName: neoxT4.nativeCurrency.name,
      chain: neoxT4.nativeCurrency.symbol,
    },
  ]

  useEffect(() => {
    if (!!isHydrated) return
    setIsHydrated(true)
    // @ts-ignore Hydration check only updates on initial render
  }, [])

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
            <DynamicWagmiConnector>
              {isLoading || !isHydrated ? <Loading /> : children}
            </DynamicWagmiConnector>
          }
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}

export default AuthContextProvider

'use client'
import type { IconType } from 'react-icons'
import {
  HiOutlineHome,
  HiOutlineCollection,
  HiOutlineChartSquareBar,
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { usePathname } from 'next/navigation'
import Button from '@/components/atoms/Button'
import { getAuthToken } from '@dynamic-labs/sdk-react-core'
import { useSession, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import useIndexCampaigns from '@/utils/campaign/indexCampaign'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { Chain } from '../lib/chains'
import { useAccount } from 'wagmi'

interface MenuConfig {
  title: string
  icon: IconType
  to: string
}

const menuConfig: MenuConfig[] = [
  {
    title: 'Home',
    icon: HiOutlineHome,
    to: '/',
  },
  {
    title: 'Campaigns',
    icon: HiOutlineCollection,
    to: '/campaign',
  },
  {
    title: 'Statistics',
    icon: HiOutlineChartSquareBar,
    to: '/statistics',
  },
  {
    title: 'Payouts',
    icon: HiOutlineCurrencyDollar,
    to: '/payouts',
  },
  {
    title: 'My Organization',
    icon: HiOutlineOfficeBuilding,
    to: '/my-organization',
  },
]

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { chain } = useAccount()
  const chainId = chain?.id || 1

  const path = usePathname()
  const authToken = getAuthToken()
  const session = useSession()

  const [selectedConfig, setSelectedConfig] = useState(
    menuConfig.find((config) => {
      const currentPath = path.replace('/dashboard', '')
      if (config.title === 'Home') {
        return currentPath === config.to
      }
      return currentPath.startsWith(config.to)
    }) ?? menuConfig[0]
  )

  const { mutate: forceReindex, isPending: isReindexing } = useIndexCampaigns()

  useEffect(() => {
    if (session.data?.user && !authToken) {
      signOut({ callbackUrl: 'http://localhost:3000' })
      toast.error('You are session has expired')
    }
  }, [session.data?.user, authToken])

  const { handleLogOut } = useDynamicContext()

  return (
    <main>
      <div className="min-h-screen flex flex-col">
        <div className="lg:hidden py-2 px-4 sticky top-0 z-30 h-16 bg-opacity-90 flex gap-4 items-center bg-white">
          <label htmlFor="my-drawer" className="btn drawer-button">
            <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <div className="font-semibold text-lg grow">
            <Link href={`/dashboard`}>
              <span className="text-3xl font-bold">XioPay</span>
            </Link>
          </div>
        </div>

        <div className="drawer lg:drawer-open w-full h-full grow">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="px-4 flex items-center flex-col w-full h-full drawer-content bg-base-200">
            <div className="w-full flex sticky justify-end p-2 items-center gap-4">
              <Button
                loading={isReindexing}
                styling="primary"
                size="sm"
                onClick={() =>
                  forceReindex({
                    contractAddress: getCampaignDeploymentAddress(chainId),
                    chainId: Chain.NEOX_TESTNET.toString(),
                  })
                }
              >
                Reindex
              </Button>

              <DynamicWidget />
            </div>
            <div className="py-8 flex-1 max-w-3xl w-full">{children}</div>
            <footer className="text-center mb-4">
              <p>Built with 💚 for Neo Hackathon</p>
            </footer>
          </div>
          <div className="drawer-side lg:mt-0">
            <aside className="bg-white h-full w-60 p-4 mt-16 lg:mt-0 flex-col flex">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay lg:hidden"
              />
              <div className="hidden lg:block font-semibold text-2xl border-b border-gray-200 mb-2 pb-2">
                XioPay
              </div>
              <ul className="menu menu-md bg-white text-base-content space-y-1 flex-1 w-full px-0">
                {menuConfig.map((item) => (
                  <li
                    key={item.title}
                    className=""
                    onClick={() => setSelectedConfig(item)}
                  >
                    <Link
                      className={
                        item.title === selectedConfig.title ? 'bg-base-300' : ''
                      }
                      href={`/dashboard${item.to}`}
                    >
                      <item.icon
                        className={`${item.title === selectedConfig.title ? 'fill-brand' : ''} text-[1.2rem]`}
                      />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <Button styling="secondary" onClick={() => handleLogOut()}>
                Logout
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

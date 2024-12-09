'use client'
import type { IconType } from 'react-icons'
import { HiOutlineHome } from 'react-icons/hi'
import { HiOutlineCollection } from 'react-icons/hi'
import Link from 'next/link'
import { useState } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

interface MenuConfig {
  title: string
  icon: IconType
  to: string
}

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [selectedConfig, setSelectedConfig] = useState('Home')

  const { handleLogOut } = useDynamicContext()

  const menuConfig: MenuConfig[] = [
    {
      title: 'Home',
      icon: HiOutlineHome,
      to: '/dashboard',
    },
    {
      title: 'Campaigns',
      icon: HiOutlineCollection,
      to: '/dashboard/campaign',
    },
  ]

  return (
    <main>
      <div className="h-screen">
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
          <div className="font-semibold text-lg">XioPay</div>
        </div>

        <div className="drawer lg:drawer-open w-full h-full">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="py-4 px-4 flex items-center flex-col w-full h-full drawer-content bg-base-200">
            <div className="py-8 flex-1 max-w-3xl w-full">{children}</div>
            <footer className="text-center">
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
              <ul className="menu menu-md bg-white text-base-content space-y-1 flex-1 px-0">
                {menuConfig.map((item) => (
                  <li
                    key={item.title}
                    className=""
                    onClick={() => setSelectedConfig(item.title)}
                  >
                    <Link
                      className={
                        item.title === selectedConfig ? 'bg-base-300' : ''
                      }
                      href={item.to}
                    >
                      <item.icon
                        className={`${item.title === selectedConfig ? 'fill-brand' : ''} text-[1.2rem]`}
                      />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleLogOut()}
              >
                Logout
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

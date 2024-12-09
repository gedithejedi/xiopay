'use client'

import { useAccount } from 'wagmi'
import Link from 'next/link'

export default function Home() {
  const { address, isConnected } = useAccount()

  return (
    <div className="flex flex-col h-full">
      <main className="flex flex-col flex-1 gap-8 items-center justify-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-8xl font-bold tracking-tighter text-center">
            Fund your work
            <br /> with crypto
          </h1>
          <p className="text-2xl text-center">
            Accept support, with no people in the middle. <br /> You own the
            money you receive. Free of debanking.
          </p>
        </div>

        <Link
          href={isConnected ? '/dashboard' : '/login'}
          className="btn btn-lg btn-accent text-2xl"
        >
          Create my campaign
        </Link>

        {isConnected && (
          <div className="border-2 border-primary rounded-md p-4 flex flex-row gap-4">
            <div className="flex flex-row gap-6">
              <div>address</div>
              <div>{address}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

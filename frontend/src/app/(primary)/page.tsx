'use client'

import ConnectButton from '@/components/authentication/components/ConnectButton'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  return (
    <div className="flex flex-col items-center justify-between min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className="flex w-full p-3">
        <span className="text-3xl font-bold">XioPay</span>
      </header>

      <main className="flex flex-col gap-8 items-center">
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

        <ConnectButton className="btn btn-lg btn-accent text-2xl">
          Create my campaign
        </ConnectButton>

        {isConnected && (
          <div className="border-2 border-primary rounded-md p-4 flex flex-row gap-4">
            <div className="flex flex-row gap-6">
              <div>address</div>
              <div>{address}</div>
            </div>
          </div>
        )}
      </main>
      <footer className="flex gap-2 flex-wrap items-center justify-center pb-6 flex-col">
        <p>Built with 💚 for Neo Hackathon</p>
      </footer>
    </div>
  )
}

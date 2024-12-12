import Link from 'next/link'
import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()

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
          href={session ? '/dashboard' : '/login'}
          className="btn btn-lg btn-accent text-2xl"
        >
          {session ? 'Go to dashboard' : 'Create your campaign'}
        </Link>
      </main>
    </div>
  )
}

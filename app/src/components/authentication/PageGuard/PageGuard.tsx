'use client'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useEffect, useState } from 'react'
import { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import path from 'path'

enum AuthStatus {
  NotAuthorized = 0,
  Authorized = 1,
}

const pageAuthConfig: Record<string, AuthStatus> = {
  '/dashboard': AuthStatus.Authorized,
  '/login': AuthStatus.NotAuthorized,
}

export default function PageGuard({ children }: { children: ReactNode }) {
  const { user } = useDynamicContext()

  const [isAuthed, setIsAuthed] = useState(false)
  const pathName = usePathname()
  const router = useRouter()

  useEffect(() => {
    const dirPath = path.parse(pathName)?.dir

    const isAuthPage =
      pageAuthConfig[pathName] === AuthStatus.Authorized ||
      pageAuthConfig[dirPath] === AuthStatus.Authorized
    const isNotAuthPage =
      pageAuthConfig[pathName] === AuthStatus.NotAuthorized ||
      pageAuthConfig[dirPath] === AuthStatus.NotAuthorized

    if (isAuthPage && !user) {
      router.replace('/')
    } else if (isNotAuthPage && user) {
      router.replace('/dashboard')
    } else {
      setIsAuthed(true)
    }
  }, [pathName, user])

  return isAuthed && <>{children}</>
}

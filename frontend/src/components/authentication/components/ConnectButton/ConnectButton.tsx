'use client'

import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core'

import { ConnectButtonProps } from './ConnectButton.type'
import { signIn } from '@/auth'

const ConnectButton = ({
  children,
  className,
  disabled,
}: ConnectButtonProps) => {
  const isAuthenticated = useIsLoggedIn()

  const isFullyConnected = useIsLoggedIn()

  if (isAuthenticated || isFullyConnected) return <DynamicWidget />

  return <DynamicWidget />
}

export default ConnectButton

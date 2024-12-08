'use client'

import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core'

import { ConnectButtonProps } from './ConnectButton.type'

const ConnectButton = ({
  children,
  className,
  disabled,
}: ConnectButtonProps) => {
  const isAuthenticated = useIsLoggedIn()
  const { setShowAuthFlow } = useDynamicContext()

  const isFullyConnected = useIsLoggedIn()

  const handleConnect = () => {
    setShowAuthFlow(true)
  }

  if (isAuthenticated || isFullyConnected) return <DynamicWidget />

  return (
    <button className={className} disabled={disabled} onClick={handleConnect}>
      {children || 'Login or register'}
    </button>
  )
}

export default ConnectButton

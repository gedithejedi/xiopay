'use client'

import { DynamicWidget } from '@dynamic-labs/sdk-react-core'

import { ConnectButtonProps } from './ConnectButton.type'

const ConnectButton = ({ children, className }: ConnectButtonProps) => {
  return (
    <DynamicWidget
      buttonClassName={className}
      innerButtonComponent={children}
    />
  )
}

export default ConnectButton

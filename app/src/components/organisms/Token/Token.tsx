'use client'

import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import classnames from 'classnames'

interface TokenProps {
  size?: number
  color?: string
  effect?: 'turn' | 'jump'
  className?: string
}

const Token: React.FC<TokenProps> = ({
  size = 120,
  color,
  effect = 'turn',
  className,
}) => {
  const tokenColor = color || `hsl(${Math.random() * 360}, 70%, 50%)`

  const [springs, api] = useSpring(() => ({
    transform: 'translate3d(0px, 0px, 0px) rotateY(0deg)',
    config: { tension: 300, friction: 10 },
  }))

  const handleHover = () => {
    if (effect === 'turn') {
      api.start({ transform: 'translate3d(0px, 0px, 0px) rotateY(180deg)' })
    } else {
      api.start({ transform: 'translate3d(0px, -20px, 0px) rotateY(0deg)' })
    }
  }

  const handleMouseLeave = () => {
    api.start({ transform: 'translate3d(0px, 0px, 0px) rotateY(0deg)' })
  }

  return (
    <animated.svg
      className={classnames(className)}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={springs}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <circle cx="50" cy="50" r="45" fill={tokenColor} />
      <circle cx="50" cy="50" r="35" fill="white" fillOpacity="0.3" />
      <path d="M50 20 L80 65 L20 65 Z" fill="white" fillOpacity="0.5" />
    </animated.svg>
  )
}

export default Token

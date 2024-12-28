'use client'

import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

import Spinner from '../Spinner'
import { ButtonProps, ButtonStyleTypes, ButtonSizeTypes } from './Button.types'

const Button = ({
  onClick,
  className,
  children,
  disabled,
  loading,
  styling,
  type = 'button',
  buttonRef,
  size = 'md',
}: ButtonProps) => {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled || loading}
      className={twMerge(
        classNames(
          buttonBase,
          buttonStyles[styling],
          buttonSize[size],
          className || false
        )
      )}
      type={type}
    >
      {loading && <Spinner className="mr-2 w-4" />} {children}
    </button>
  )
}

export const buttonBase =
  'flex gap-1 group cursor-pointer items-center whitespace-nowrap rounded-lg border text-[1rem] font-medium transition duration-200 disabled:pointer-events-none disabled:text-subdued'

export const buttonStyles: Record<ButtonStyleTypes, string> = {
  primary: 'btn btn-accent text-foreground',
  secondary: 'btn btn-secondary text-white',
  tertiary: 'btn btn-tertiary',
}

export const buttonSize: Record<ButtonSizeTypes, string> = {
  sm: 'h-8 min-h-8 text-sm',
  md: 'h-11 min-h-11',
  lg: 'btn-lg',
}

export default Button

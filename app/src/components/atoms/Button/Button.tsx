'use client'

import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

import Spinner from '../Spinner'
import { ButtonProps, ButtonStyleTypes } from './Button.types'

const Button = ({
  onClick,
  className,
  children,
  disabled,
  loading,
  styling,
  type = 'button',
  buttonRef,
}: ButtonProps) => {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled || loading}
      className={twMerge(
        classNames(buttonBase, buttonStyles[styling], className || false)
      )}
      type={type}
    >
      {loading && <Spinner className="mr-2 w-4" />} {children}
    </button>
  )
}

export const buttonBase =
  'flex gap-1 group cursor-pointer items-center whitespace-nowrap rounded-lg border text-[16px] font-medium transition duration-200 disabled:pointer-events-none disabled:text-subdued'

export const buttonStyles: Record<ButtonStyleTypes, string> = {
  primary: 'btn btn-accent',
  secondary: 'btn btn-secondary',
}

export default Button

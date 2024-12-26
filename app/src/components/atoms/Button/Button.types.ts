import { HTMLAttributes } from 'react'

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  loading?: boolean
  styling: ButtonStyleTypes
  type?: 'submit' | 'button'
  buttonRef?: React.RefObject<HTMLButtonElement>
  size?: ButtonSizeTypes
}

export type ButtonStyleTypes = 'primary' | 'secondary'

export type ButtonSizeTypes = 'sm' | 'md' | 'lg'

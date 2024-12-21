import { HTMLAttributes } from 'react'

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  loading?: boolean
  styling: ButtonStyleTypes
  type?: 'submit' | 'button'
  buttonRef?: React.RefObject<HTMLButtonElement>
}

export type ButtonStyleTypes = 'primary' | 'secondary'

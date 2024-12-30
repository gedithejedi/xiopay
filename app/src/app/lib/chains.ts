export const isProduction = process.env.NODE_ENV === 'production'

export enum Chain {
  NEOX = 47763,
  NEOX_TESTNET = 12227332,
  SEPOLIA = 11155111,
}

export const chainsInString = ['47763', '12227332', '11155111'] as const

export const DEFAULT_CHAIN_ID = isProduction ? Chain.NEOX_TESTNET : Chain.NEOX

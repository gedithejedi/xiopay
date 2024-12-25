import { Chain } from '@/app/lib/chains'

export const getCampaignDeploymentAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.NEOX_TESTNET:
      return '0xED8566308239403FC30026dB5cc0Df0E47E6D877'
    case Chain.NEOX:
      return ''
    case Chain.SEPOLIA:
      return '0x213127ea5c3486d4a91809be9ff69d10cb5c6173'
    default:
      return ''
  }
}

export const getTokenAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.NEOX_TESTNET:
      return '0x176AB35e905c1fD7Dd1169Ba1165729FD1f8Ab44'
    case Chain.NEOX:
      return ''
    case Chain.SEPOLIA:
      return '0x213127ea5c3486d4a91809be9ff69d10cb5c6173'
    default:
      return ''
  }
}

import { Chain } from '@/app/lib/chains'

export const getCampaignDeploymentAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.NEOX_TESTNET:
      return '0xcaf52cf7e810802e68b007de479e07a674f1a170'
    case Chain.NEOX:
      return ''
    case Chain.SEPOLIA:
      return '0x213127ea5c3486d4a91809be9ff69d10cb5c6173'
    default:
      return ''
  }
}

export const getTokenAddresses = (chain: Chain) => {
  switch (chain) {
    case Chain.NEOX_TESTNET:
      '0xcaf52cf7e810802e68b007de479e07a674f1a170'
    case Chain.NEOX:
      return ''
    case Chain.SEPOLIA:
      return '0x213127ea5c3486d4a91809be9ff69d10cb5c6173'
    default:
      return ''
  }
}

import { Chain } from '@/app/lib/chains'

export const getCampaignDeploymentAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.NEOX_TESTNET:
      return '0x48a4fbee59f66b6204513868b475d4f86fbd78c5'
    case Chain.NEOX:
      return ''
    case Chain.SEPOLIA:
      return '0x213127ea5c3486d4a91809be9ff69d10cb5c6173'
    default:
      return ''
  }
}

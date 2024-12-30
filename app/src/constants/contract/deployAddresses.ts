import { Chain } from '@/app/lib/chains'

export const getCampaignDeploymentAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.NEOX_TESTNET:
      return '0x7cd746824a59E733744560eba905A08e6db5dC97'
    case Chain.NEOX:
      return '0x93939291f9cFeFBbd88D01E8D725f751DE93d331'
    case Chain.SEPOLIA:
      return '0x213127ea5c3486d4a91809be9ff69d10cb5c6173'
    default:
      return ''
  }
}

export const getTokenAddress = (chain: Chain) => {
  switch (chain) {
    case Chain.NEOX_TESTNET:
      return '0x5e2D16a78b614b71eb74feCE22A766eC631C13e3'
    case Chain.NEOX:
      return '0x91262f08f2681a3150e6be2f36a2d0cb4b738f34'
    case Chain.SEPOLIA:
      return '0x213127ea5c3486d4a91809be9ff69d10cb5c6173'
    default:
      return ''
  }
}

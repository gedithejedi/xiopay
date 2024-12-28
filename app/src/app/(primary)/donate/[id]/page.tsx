'use client'

import { Chain } from '@/app/lib/chains'
import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import DonationWidget from '@/components/organisms/DonationWidget'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import useUnwrapParams from '@/hooks/unwrapParams'
import { useGetCampaingById } from '@/utils/campaign/getCampaignById'
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import React from 'react'
import { useAccount } from 'wagmi'

type Props = {
  params: {
    id: string
  }
}

export default function Donate({ params }: Props) {
  const { address, chain } = useAccount()
  const chainId = chain?.id || 1

  const unwrappedParams = useUnwrapParams(Promise.resolve(params))
  const campaignId = unwrappedParams?.id || ''

  const { data: campaignData, isLoading } = useGetCampaingById({
    contractAddress: getCampaignDeploymentAddress(chainId),
    campaignId,
    chainId: Chain.NEOX_TESTNET.toString(),
  })

  // const contractBalance = useMemo(() => {
  //   if (!campaignData) return 0

  //   const balance = formatEther(campaignData.balance)
  //   return balance
  // }, [campaignData])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full flex justify-end">
        <DynamicWidget />
      </div>

      <Card>
        <DonationWidget
          title={campaignData?.name || 'Campaign'}
          campaignId={campaignId}
        />
      </Card>
    </div>
  )
}

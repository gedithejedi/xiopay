'use client'

import { Chain } from '@/app/lib/chains'
import Card from '@/components/atoms/Card'
import Loading from '@/components/atoms/Loading'
import DonationWidget from '@/components/organisms/DonationWidget'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import useUnwrapParams from '@/hooks/unwrapParams'
import { useGetCampaignById } from '@/utils/campaign/getCampaignById'
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import React from 'react'
import { useAccount } from 'wagmi'

type Props = {
  params: {
    id: string
  }
}

export default function Donate({ params }: Props) {
  const { chain } = useAccount()
  const chainId = chain?.id || 1

  const unwrappedParams = useUnwrapParams(Promise.resolve(params))
  const campaignId = unwrappedParams?.id || ''

  const { data: campaignData, isLoading } = useGetCampaignById({
    contractAddress: getCampaignDeploymentAddress(chainId),
    campaignId,
    chainId: Chain.NEOX_TESTNET.toString(),
  })

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col gap-3 min-w-[500px]">
        <div className="w-full flex justify-end">
          <DynamicWidget />
        </div>

        <Card>
          <DonationWidget campaignData={campaignData} />
        </Card>
      </div>
    </div>
  )
}

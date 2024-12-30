'use client'

import Card from '@/components/atoms/Card'
import Loading from '@/components/atoms/Loading'
import DonationWidget from '@/components/organisms/DonationWidget'
import { useGetCampaignById } from '@/utils/campaign/getCampaignById'
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import React from 'react'
import { useAccount } from 'wagmi'
import { DonateProps } from './Donate.types'
import { DEFAULT_CHAIN_ID } from '@/app/lib/chains'

export default function Donate({ campaignId }: DonateProps) {
  const { chain } = useAccount()
  const chainId = chain?.id || DEFAULT_CHAIN_ID

  const { data: campaignData, isLoading } = useGetCampaignById({
    campaignId,
    chainId,
  })

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-3 min-w-[500px]">
      <div className="w-full flex justify-end">
        <DynamicWidget />
      </div>

      <Card>
        <DonationWidget campaignData={campaignData} />
      </Card>
    </div>
  )
}

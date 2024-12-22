'use client'

import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import Spinner from '@/components/atoms/Spinner'
import useUnwrapParams from '@/hooks/unwrapParams'
import { useGetCampaingById } from '@/utils/campaign/getCampaignById'
import React from 'react'
import { useMemo } from 'react'
import { formatEther } from 'viem'

type Props = {
  params: {
    id: string
  }
}

export default function Campaign({ params }: Props) {
  const unwrappedParams = useUnwrapParams(Promise.resolve(params))
  const campaignId = unwrappedParams?.id || ''

  const { data: campaignData, isLoading } = useGetCampaingById({
    contractAddress: '0xcaf52Cf7e810802e68b007DE479E07a674f1a170',
    campaignId,
  })

  const contractBalance = useMemo(() => {
    if (!campaignData) return 0

    const balance = formatEther(campaignData.balance)
    return balance
  }, [campaignData])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Spinner className="w-10 h-10" />
      </div>
    )
  }

  return (
    <>
      <PageTitle>Campaign</PageTitle>

      <Card>
        <p>{campaignData?.name}</p>
        <p>{campaignData?.creator}</p>
        <p>Balance: {contractBalance}</p>
      </Card>
    </>
  )
}

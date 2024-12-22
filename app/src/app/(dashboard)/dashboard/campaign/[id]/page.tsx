'use client'

import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import Spinner from '@/components/atoms/Spinner'
import useUnwrapParams from '@/hooks/unwrapParams'
import { useGetCampaingById } from '@/utils/campaign/getCampaignById'
import React from 'react'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import { FaRegUser, FaWallet } from 'react-icons/fa'

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
        <div className="flex justify-between ">
          <h2 className="text-2xl font-bold tracking-tight">
            {campaignData?.name || 'Campaign Name'}
          </h2>
          <div className="my-2 flex items-center gap-3 font-medium text-gray-500">
            <FaRegUser className="h-4 w-4" />
            <span className="text-sm">
              Created by: {campaignData?.creator || 'Unknown Creator'}
            </span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-y-4 px-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 text-base font-semibold">
              <FaWallet className="h-5 w-5" />
              <p>Balance</p>
              <p className="font-semibold">{contractBalance || '0'}</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

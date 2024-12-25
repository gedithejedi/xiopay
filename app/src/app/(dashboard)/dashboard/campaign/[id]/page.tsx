'use client'

import PageTitle from '@/components/atoms/PageTitle'
import Spinner from '@/components/atoms/Spinner'
import useUnwrapParams from '@/hooks/unwrapParams'
import { useGetCampaingById } from '@/utils/campaign/getCampaignById'
import React from 'react'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import CampaignCard from '@/components/organisms/CampaignCard'
import Link from 'next/link'
import Button from '@/components/atoms/Button'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { useAccount } from 'wagmi'

type Props = {
  params: {
    id: string
  }
}

export default function Campaign({ params }: Props) {
  const { chain } = useAccount()
  const chainId = chain?.id || 1

  const unwrappedParams = useUnwrapParams(Promise.resolve(params))
  const campaignId = unwrappedParams?.id || ''

  const { data: campaignData, isLoading } = useGetCampaingById({
    contractAddress: getCampaignDeploymentAddress(chainId),
    campaignId,
  })

  const contractBalance = useMemo(() => {
    if (!campaignData) return 0

    const balance = formatEther(campaignData.balance || BigInt('0'))
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

      <CampaignCard
        name={campaignData?.name || 'Campaign Name'}
        creator={campaignData?.creator || 'Unknown Creator'}
        balance={contractBalance || '0'}
      >
        <div className="flex w-full justify-end">
          <Link href={`/donate/${campaignId}`} target="_blank">
            <Button styling={'secondary'}>View page</Button>
          </Link>
        </div>
      </CampaignCard>
    </>
  )
}

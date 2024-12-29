'use client'

import { useGetCampaignById } from '@/utils/campaign/getCampaignById'
import React from 'react'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import CampaignCard from '@/components/organisms/CampaignCard'
import Link from 'next/link'
import Button from '@/components/atoms/Button'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { useAccount } from 'wagmi'
import Card from '@/components/atoms/Card'
import DonationWidget from '@/components/organisms/DonationWidget'
import { Chain } from '@/app/lib/chains'
import { CampaignProps } from './Campaign.types'
import LoadingPage from '@/app/(dashboard)/loading'

export default function Campaign({ id }: CampaignProps) {
  const { chain } = useAccount()
  const chainId = chain?.id || 1

  const campaignId = id || ''

  const { data: campaignData, isLoading } = useGetCampaignById({
    contractAddress: getCampaignDeploymentAddress(chainId),
    campaignId,
    chainId: Chain.NEOX_TESTNET.toString(),
  })

  const contractBalance = useMemo(() => {
    if (!campaignData) return 0

    const balance = formatEther(campaignData.balance || BigInt('0'))
    return balance
  }, [campaignData])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="flex flex-col gap-4">
      <CampaignCard
        name={campaignData?.name || 'Campaign Name'}
        creator={campaignData?.creator || 'Unknown Creator'}
        balance={contractBalance || '0'}
      ></CampaignCard>

      <Card className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-lg font-semibold">Preview:</h3>
          <Link href={`/donate/${campaignId}`} target="_blank">
            <Button size="sm" styling={'secondary'}>
              Open donation page
            </Button>
          </Link>
        </div>
        <div className="bg-base-300 rounded-lg p-4">
          <DonationWidget isDemoMode={true} campaignData={campaignData} />
        </div>
      </Card>
    </div>
  )
}

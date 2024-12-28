'use client'

import PageLayout from '@/components/organisms/PageLayout'
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
import Card from '@/components/atoms/Card'
import DonationWidget from '@/components/organisms/DonationWidget'
import { Chain } from '@/app/lib/chains'
import useIndexCampaigns from '@/utils/campaign/indexCampaign'

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
    chainId: Chain.NEOX_TESTNET.toString(),
  })

  const contractBalance = useMemo(() => {
    if (!campaignData) return 0

    const balance = formatEther(campaignData.balance || BigInt('0'))
    return balance
  }, [campaignData])

  const { mutate: forceReindex, isPending: isReindexing } = useIndexCampaigns()

  const customHeader = (
    <Button
      styling="primary"
      onClick={() =>
        forceReindex({
          contractAddress: getCampaignDeploymentAddress(chainId),
          chainId: Chain.NEOX_TESTNET.toString(),
        })
      }
    >
      Reindex Campaign
    </Button>
  )

  return (
    <PageLayout
      title="Campaign"
      isLoading={isLoading}
      customHeader={customHeader}
    >
      <div className="flex flex-col gap-4">
        <CampaignCard
          name={campaignData?.name || 'Campaign Name'}
          creator={campaignData?.creator || 'Unknown Creator'}
          balance={contractBalance || '0'}
        ></CampaignCard>

        <Card className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-lg font-semibold">Preview:</h3>
            <Link href={`/donate/${campaignId}`} target="_blank">
              <Button size="sm" styling={'secondary'}>
                Open donation page
              </Button>
            </Link>
          </div>
          <div className="bg-base-300 rounded-lg p-4">
            <DonationWidget
              isDemoMode={true}
              title={campaignData?.name || 'Campaign Name'}
              campaignId={campaignId}
            />
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}

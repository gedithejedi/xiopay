'use client'

import { useGetCampaignById } from '@/utils/campaign/getCampaignById'
import React from 'react'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import CampaignCard from '@/components/organisms/CampaignCard'
import Link from 'next/link'
import Button from '@/components/atoms/Button'
import { useAccount } from 'wagmi'
import Card from '@/components/atoms/Card'
import DonationWidget from '@/components/organisms/DonationWidget'
import { CampaignProps } from './Campaign.types'
import LoadingPage from '@/app/(dashboard)/loading'
import { DEFAULT_CHAIN_ID } from '@/app/lib/chains'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import CampaignGuide from '@/components/organisms/CampaignGuide'

export default function Campaign({ id }: CampaignProps) {
  const { chain } = useAccount()
  const chainId = chain?.id || DEFAULT_CHAIN_ID

  const campaignId = id || ''
  const campaignUrl = `/donate/${campaignId}`

  const { data: campaignData, isLoading } = useGetCampaignById({
    campaignId,
    chainId,
  })

  const contractBalance = useMemo(() => {
    if (!campaignData) return 0

    const balance = formatEther(campaignData.balance || BigInt('0'))
    return balance
  }, [campaignData])

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard')
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="flex flex-col gap-4">
      <CampaignCard
        name={campaignData?.name || 'Campaign Name'}
        creator={campaignData?.creator || 'Unknown Creator'}
        balance={contractBalance || '0'}
      >
        <div className="mt-6">
          <CampaignGuide campaignId={campaignId} />
        </div>
      </CampaignCard>

      <Card className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-lg font-semibold">Preview:</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              styling="tertiary"
              className="flex gap-2"
              onClick={() =>
                copyToClipboard(`${window.location.origin}${campaignUrl}`)
              }
            >
              <HiOutlineDocumentDuplicate /> Copy link
            </Button>
            <Link href={campaignUrl} target="_blank">
              <Button size="sm" styling={'secondary'}>
                Open page
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-base-300 rounded-lg p-4">
          <DonationWidget isDemoMode={true} campaignData={campaignData} />
        </div>
      </Card>
    </div>
  )
}

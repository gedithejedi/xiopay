'use client'

import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import CampaignCard from '@/components/organisms/CampaignCard'
import PageLayout from '@/components/organisms/PageLayout'
import { getCampaigns } from '@/utils/campaign/getCampaigns'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { HiOutlineFolder } from 'react-icons/hi'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { DEFAULT_CHAIN_ID } from '@/app/lib/chains'

function CampaignsHeaderButton() {
  return (
    <Button styling="primary">
      <Link href={'/dashboard/campaign/create'}>Create a campaign</Link>
    </Button>
  )
}

export default function Campaigns() {
  const { address, isConnected, chain } = useAccount()
  const creator = address || ''
  const chainId = chain?.id || DEFAULT_CHAIN_ID

  const { data: campaignData, isLoading } = useQuery({
    queryKey: ['campaign', creator, chainId],
    queryFn: async () => {
      try {
        const campaigns = await getCampaigns({
          creator,
          chainId,
        })

        return campaigns?.map((campaign) => ({
          ...campaign,
          balance: formatEther(campaign.balance),
        }))
      } catch (error: unknown) {
        console.error(error)
        return []
      }
    },
    enabled: !!creator,
  })

  return (
    <PageLayout
      title="Campaigns"
      isLoading={isLoading}
      headerChildren={<CampaignsHeaderButton />}
    >
      {!isConnected || (!!campaignData && !campaignData.length) ? (
        <Card className="flex flex-col gap-2">
          <div className="text-center flex flex-col gap-1 items-center">
            <HiOutlineFolder className="text-4xl text-base-400" />
            <p className="text-lg font-semibold">
              You haven&apos;t added any widgets yet.
            </p>
            <p className="">
              Set one up in few easy steps, by clicking the button below
            </p>
          </div>
          <div className="flex justify-center w-full mt-2">
            <Button styling="primary">
              <Link href={'/dashboard/campaign/create'}>Create a campaign</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {campaignData?.map((campaign) => (
            <CampaignCard
              key={campaign.campaignId}
              name={campaign.name}
              creator={campaign.creator}
              balance={campaign?.balance ?? '0'}
            >
              <div className="flex w-full justify-end">
                <Link href={`/dashboard/campaign/${campaign.campaignId}`}>
                  <Button styling="secondary">Campaign details</Button>
                </Link>
              </div>
            </CampaignCard>
          ))}
        </div>
      )}
    </PageLayout>
  )
}

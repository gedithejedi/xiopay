'use client'

import { Chain } from '@/app/lib/chains'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import CampaignCard from '@/components/organisms/CampaignCard'
import PageLayout from '@/components/organisms/PageLayout'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { getCampaigns } from '@/utils/campaign/getCampaigns'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { HiOutlineFolder } from 'react-icons/hi'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

function CampaignsHeaderButton() {
  return (
    <Button styling="primary">
      <Link href={'/dashboard/campaign/create'}>Create a campaign</Link>
    </Button>
  )
}

export default function Campaigns() {
  const { address, isConnected } = useAccount()
  const contractAddress = getCampaignDeploymentAddress(Chain.NEOX_TESTNET)
  const creator = address || ''

  const { data: campaignData, isLoading } = useQuery({
    queryKey: ['campaign', contractAddress, creator],
    queryFn: async () => {
      try {
        const campaigns = await getCampaigns({ contractAddress, creator })

        return campaigns?.map((campaign) => ({
          ...campaign,
          balance: formatEther(campaign.balance),
        }))
      } catch (error: any) {
        console.error(error)
        return []
      }
    },
    enabled: !!contractAddress && !!creator,
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

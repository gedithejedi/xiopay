'use client'

import { Chain } from '@/app/lib/chains'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { useGetCampaigns } from '@/utils/campaign/getCampaigns'
import Link from 'next/link'
import { HiOutlineFolder } from 'react-icons/hi'
import { useAccount } from 'wagmi'

export default function Campaigns() {
  const { address, isConnected } = useAccount()

  const { data: campaignData, isLoading } = useGetCampaigns({
    contractAddress: getCampaignDeploymentAddress(Chain.NEOX_TESTNET),
    creator: address || '',
  })

  console.log(campaignData)

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <div className="flex justify-between">
        <PageTitle>Campaigns</PageTitle>

        {!!campaignData && (
          <Button styling="primary">
            <Link href={'/dashboard/campaign/create'}>Create a campaign</Link>
          </Button>
        )}
      </div>

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
            <Card key={campaign.campaignId}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{campaign.name}</p>
                  <p className="text-sm">{campaign.creator}</p>
                </div>
                <div>
                  <Link href={`/dashboard/campaign/${campaign.campaignId}`}>
                    View
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

'use client'
import Card from '@/components/atoms/Card'
import PageTitle from '@/components/atoms/PageTitle'
import { useGetCampaingById } from '@/utils/campaign/getCampaignById'
import { useMemo } from 'react'
import { formatEther } from 'viem'

type Props = {
  params: {
    id: string
  }
}

export default function Campaign({ params }: Props) {
  const { id: campaignId } = params

  const { data: campaignData, isLoading } = useGetCampaingById({
    contractAddress: '0xcaf52Cf7e810802e68b007DE479E07a674f1a170',
    campaignId,
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  const contractBalance = useMemo(() => {
    if (!campaignData) return 0

    const balance = formatEther(campaignData.balance)
    return balance
  }, [campaignData])

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

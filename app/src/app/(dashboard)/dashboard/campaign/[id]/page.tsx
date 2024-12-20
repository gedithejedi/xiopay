'use client'
import PageTitle from '@/components/atoms/PageTitle'
import { useGetCampaingById } from '@/utils/campaign/getCampaignById'

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

  console.log(campaignData)

  return (
    <>
      <PageTitle>Campaign</PageTitle>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>{campaignData?.name}</p>
          <p>{campaignData?.creator}</p>
        </div>
      )}
    </>
  )
}

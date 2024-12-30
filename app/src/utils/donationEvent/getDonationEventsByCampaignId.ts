import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { DonationEventInterface } from '@/../db/models/donationEvent-model'
import { DonationFilter } from '@/app/api/donationEvent/donationEvent.service'

type GetDonationEventsByCampaignIdResult = DonationEventInterface[] | null

export const getDonationEventsByCampaignId = async ({
  chainId,
  campaignId,
  filters,
}: {
  chainId: number
  campaignId: string
  filters: DonationFilter
}): Promise<GetDonationEventsByCampaignIdResult> => {
  try {
    const apiUrl = `/api/donationEvent/${chainId}/getByCampaignId/${campaignId}`
    const { data } = await axios.get(apiUrl, {
      params: filters,
    })

    return data.data
  } catch (error: unknown) {
    console.error(error)
    return null
  }
}

export const useGetDonationEventsByCampaignId = ({
  chainId,
  campaignId,
  filters,
  config = {},
}: {
  chainId: number
  campaignId?: string
  filters?: DonationFilter
  config?: Omit<
    UseQueryOptions<
      GetDonationEventsByCampaignIdResult,
      Error,
      GetDonationEventsByCampaignIdResult
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >
}) => {
  return useQuery<GetDonationEventsByCampaignIdResult, Error>({
    queryKey: ['campaign', campaignId, chainId],
    queryFn: () =>
      filters && campaignId
        ? getDonationEventsByCampaignId({ chainId, campaignId, filters })
        : null,
    enabled: !!filters && !!campaignId,
    ...config,
  })
}

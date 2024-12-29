import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { DonationEventInterface } from '@/../db/models/donationEvent-model'
import { DonationFilterByCampaignId } from '@/app/api/donationEvent/donationEvent.service'

type GetDonationEventsByCampaignIdResult = DonationEventInterface | null

export const getDonationEventsByCampaignId = async ({
  chainId,
  filters,
}: {
  chainId: number
  filters: DonationFilterByCampaignId
}): Promise<GetDonationEventsByCampaignIdResult> => {
  try {
    const apiUrl = `/api/donationEvent/${chainId}/getByCampaignId`
    const { data } = await axios.get(apiUrl, {
      data: filters,
    })

    return data.data
  } catch (error: unknown) {
    console.error(error)
    return null
  }
}

export const useGetDonationEventsByCampaignId = ({
  chainId,
  filters,
  config = {},
}: {
  chainId: number
  filters: DonationFilterByCampaignId
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
    queryKey: ['campaign', chainId],
    queryFn: () => getDonationEventsByCampaignId({ chainId, filters }),
    ...config,
  })
}

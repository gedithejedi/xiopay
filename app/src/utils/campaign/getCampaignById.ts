import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Campaign } from './getCampaigns'

export const getCampaignById = async ({
  campaignId,
  contractAddress,
}: {
  campaignId: string
  contractAddress: string
}): Promise<Campaign | any> => {
  try {
    const apiUrl = `/api/campaign/${contractAddress}/${campaignId}`
    const { data } = await axios.get(apiUrl)

    return data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { message: error.message, status: error.response?.status }
    } else {
      return { message: 'An unexpected error occurred' }
    }
  }
}

export const useGetCampaingById = ({
  campaignId,
  contractAddress,
  config = {},
}: {
  campaignId: string
  contractAddress: string
  config?: Omit<UseQueryOptions<Campaign, Error>, 'queryKey'>
}) => {
  return useQuery<Campaign, Error>({
    queryKey: ['campaign', contractAddress, campaignId],
    queryFn: () => getCampaignById({ contractAddress, campaignId }),
    enabled: !!contractAddress || !!campaignId,
    staleTime: 300000,
    ...config,
  })
}
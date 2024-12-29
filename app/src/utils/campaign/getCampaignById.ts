import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Campaign } from './getCampaigns'

export const getCampaignById = async ({
  campaignId,
  chainId,
}: {
  campaignId: string
  chainId: string
}): Promise<Campaign | any> => {
  try {
    const apiUrl = `/api/campaign/${chainId}/${campaignId}`
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

export const useGetCampaignById = ({
  campaignId,
  chainId,
  config = {},
}: {
  campaignId: string
  chainId: string
  config?: Omit<UseQueryOptions<Campaign, Error>, 'queryKey'>
}) => {
  return useQuery<Campaign, Error>({
    queryKey: ['campaign', chainId, campaignId],
    queryFn: () => getCampaignById({ campaignId, chainId }),
    enabled: !!!!campaignId,
    ...config,
  })
}

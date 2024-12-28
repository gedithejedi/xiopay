import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Campaign } from './getCampaigns'

export const getCampaignById = async ({
  campaignId,
  contractAddress,
  chainId,
}: {
  campaignId: string
  contractAddress: string
  chainId: string
}): Promise<Campaign | any> => {
  try {
    const apiUrl = `/api/campaign/${chainId}/${contractAddress}/${campaignId}`
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
  chainId,
  config = {},
}: {
  campaignId: string
  contractAddress: string
  chainId: string
  config?: Omit<UseQueryOptions<Campaign, Error>, 'queryKey'>
}) => {
  return useQuery<Campaign, Error>({
    queryKey: ['campaign', chainId, contractAddress, campaignId],
    queryFn: () => getCampaignById({ contractAddress, campaignId, chainId }),
    enabled: !!contractAddress || !!campaignId,
    ...config,
  })
}

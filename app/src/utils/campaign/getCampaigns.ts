import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Campaign {
  campaignId: string
  creator: string
  name: string
}

export const getCampaigns = async ({
  contractAddress,
  creator,
}: {
  contractAddress: string
  creator: string
}): Promise<Campaign[] | any> => {
  try {
    const apiUrl = `/api/campaign/${contractAddress}`
    const { data } = await axios.get(apiUrl, { params: { creator } })

    return data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { message: error.message, status: error.response?.status }
    } else {
      return { message: 'An unexpected error occurred' }
    }
  }
}

export const useGetCampaigns = ({
  contractAddress,
  creator,
  config = {},
}: {
  contractAddress: string
  creator: string
  config?: Omit<UseQueryOptions<Campaign[], Error>, 'queryKey'>
}) => {
  return useQuery<Campaign[], Error>({
    queryKey: ['campaign', contractAddress, creator],
    queryFn: () => getCampaigns({ contractAddress, creator }),
    enabled: !!contractAddress && !!creator,
    staleTime: 300000,
    ...config,
  })
}

import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export interface Campaign {
  campaignId: string
  creator: string
  name: string
  balance: bigint
}

export const getCampaigns = async ({
  contractAddress,
  creator,
}: {
  contractAddress: string
  creator: string
}): Promise<Campaign[]> => {
  try {
    const apiUrl = `/api/campaign/${contractAddress}`
    const { data } = await axios.get(apiUrl, { params: { creator } })

    return data.data
  } catch (error: any) {
    toast.error(error.message)
    return []
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

import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export interface Campaign {
  campaignId: string
  creator: string
  contractAddress: string
  chainId: string
  name: string
  balance: bigint
  latestBlockUpdate: number
  updatedAt?: number
}

export const getCampaigns = async ({
  contractAddress,
  creator,
  chainId,
}: {
  contractAddress: string
  creator: string
  chainId: string
}): Promise<Campaign[]> => {
  try {
    const apiUrl = `/api/campaign/${chainId}/${contractAddress}`
    const { data } = await axios.get(apiUrl, { params: { creator } })

    return data.data
  } catch (error: any) {
    console.error(error)
    toast.error('Something went wrong while fetching campaigns.')
    return []
  }
}

export const useGetCampaigns = ({
  contractAddress,
  creator,
  chainId,
  config = {},
}: {
  contractAddress: string
  creator: string
  chainId: string
  config?: Omit<UseQueryOptions<Campaign[], Error>, 'queryKey'>
}) => {
  return useQuery<Campaign[], Error>({
    queryKey: ['campaign', chainId, contractAddress, creator],
    queryFn: () => getCampaigns({ contractAddress, creator, chainId }),
    enabled: !!contractAddress && !!creator,
    staleTime: 300000,
    ...config,
  })
}

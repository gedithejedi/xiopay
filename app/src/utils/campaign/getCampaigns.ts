import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import type { CampaignInterface } from '../../../db/models/campaign-model'

export const getCampaigns = async ({
  creator,
  chainId,
}: {
  creator: string
  chainId: number
}): Promise<CampaignInterface[]> => {
  try {
    const apiUrl = `/api/campaign/${chainId}`
    const { data } = await axios.get(apiUrl, { params: { creator } })

    return data.data
  } catch (error: unknown) {
    console.error(error)
    toast.error('Something went wrong while fetching campaigns.')
    return []
  }
}

export const useGetCampaigns = ({
  creator,
  chainId,
  config = {},
}: {
  creator: string
  chainId: number
  config?: Omit<UseQueryOptions<CampaignInterface[], Error>, 'queryKey'>
}) => {
  return useQuery<CampaignInterface[], Error>({
    queryKey: ['campaign', chainId, creator],
    queryFn: () => getCampaigns({ creator, chainId }),
    enabled: !!creator,
    staleTime: 300000,
    ...config,
  })
}

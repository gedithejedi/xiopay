import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Campaign } from './getCampaigns'

type GetCampaignByIdResult = Campaign | null

export const getCampaignById = async ({
  campaignId,
  contractAddress,
  chainId,
}: {
  campaignId: string
  contractAddress: string
  chainId: string
}): Promise<GetCampaignByIdResult> => {
  try {
    const apiUrl = `/api/campaign/${chainId}/${contractAddress}/${campaignId}`
    const { data } = await axios.get(apiUrl)

    return data.data
  } catch (error: unknown) {
    console.error(error)
    return null
  }
}

export const useGetCampaignById = ({
  campaignId,
  contractAddress,
  chainId,
  config = {},
}: {
  campaignId: string
  contractAddress: string
  chainId: string
  config?: Omit<
    UseQueryOptions<GetCampaignByIdResult, Error, GetCampaignByIdResult>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}) => {
  return useQuery<GetCampaignByIdResult, Error>({
    queryKey: ['campaign', chainId, contractAddress, campaignId],
    queryFn: () => getCampaignById({ contractAddress, campaignId, chainId }),
    enabled: !!contractAddress || !!campaignId,
    ...config,
  })
}

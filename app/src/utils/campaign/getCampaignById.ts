import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Campaign } from './getCampaigns'

type GetCampaignByIdResult = Campaign | null

export const getCampaignById = async ({
  campaignId,
  chainId,
}: {
  campaignId: string
  chainId: number
}): Promise<GetCampaignByIdResult> => {
  try {
    const apiUrl = `/api/campaign/${chainId}/${campaignId}`
    const { data } = await axios.get(apiUrl)

    return data.data
  } catch (error: unknown) {
    console.error(error)
    return null
  }
}

export const useGetCampaignById = ({
  campaignId,
  chainId,
  config = {},
}: {
  campaignId: string
  chainId: number
  config?: Omit<
    UseQueryOptions<GetCampaignByIdResult, Error, GetCampaignByIdResult>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}) => {
  return useQuery<Campaign | null, Error>({
    queryKey: ['campaign', chainId, campaignId],
    queryFn: () => getCampaignById({ campaignId, chainId }),
    enabled: !!campaignId,
    ...config,
  })
}

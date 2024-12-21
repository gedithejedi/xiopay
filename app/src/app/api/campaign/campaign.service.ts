import logger from '@/app/lib/logger'
import { indexContractEvents } from '@/lib/indexer'

export interface Campaign {
  campaignId: string
  creator: string
  name: string
}

interface CampaignsGetRequest {
  contractAddress: string
  creator?: string
}

interface CampaignsGetResponse {
  data?: Campaign[]
  error?: string
  status: number
}

export const getCampaigns = async ({
  contractAddress,
  creator,
}: CampaignsGetRequest): Promise<CampaignsGetResponse> => {
  try {
    const logs = await indexContractEvents(contractAddress)

    const data = logs.reduce((acc: any, log: any) => {
      const { args } = log
      const { campaignId: _campaignId, creator: _creator, name } = args

      if (creator) {
        if (creator?.toLowerCase() === _creator?.toLowerCase()) {
          acc.push({ campaignId: _campaignId, creator: _creator, name })
        }
        return acc
      }

      acc.push({ campaignId: _campaignId, creator, name })

      return acc
    }, [])

    return { status: 200, data }
  } catch (e: any) {
    logger.error(`Error getting contract ${contractAddress}: ${e}`)
    return {
      status: 500,
      error: e?.data?.message || e?.error?.message || e.message,
    }
  }
}

interface CampaignGetRequest {
  campaignId: string
  contractAddress: string
}

interface CampaignGetResponse {
  data?: Campaign
  error?: string
  status: number
}

export const getWithCampaignId = async ({
  campaignId,
  contractAddress,
}: CampaignGetRequest): Promise<CampaignGetResponse> => {
  try {
    const logs = await indexContractEvents(contractAddress)

    const [data] = logs.reduce((acc: any, log: any) => {
      const { args } = log
      const { campaignId: logCampaignId, creator, name } = args

      if (campaignId === logCampaignId) {
        acc.push({ campaignId: logCampaignId, creator, name })
      }
      return acc
    }, [])

    if (!data) {
      return { status: 404, error: 'Campaign not found' }
    }

    return { status: 200, data }
  } catch (e: any) {
    logger.error(`Error getting contract ${contractAddress}: ${e}`)
    return {
      status: 500,
      error: e?.data?.message || e?.error?.message || e.message,
    }
  }
}

export default { getWithCampaignId, getCampaigns }

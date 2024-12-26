import logger from '@/app/lib/logger'
import { indexContractEvents, readContract } from '@/lib/indexer'
import { Log } from 'viem'

export interface Campaign {
  campaignId: string
  creator: string
  name: string
  balance: string
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

const getCampaigns = async ({
  contractAddress,
  creator,
}: CampaignsGetRequest): Promise<CampaignsGetResponse> => {
  try {
    const logs = await indexContractEvents(contractAddress)
    const allCampaigns = [] as Campaign[]

    if (!logs || !logs.length) {
      return { status: 200, error: 'No logs found' }
    }

    for (const log of logs) {
      const { campaignId: _campaignId, creator: _creator, name } = log.args

      if (creator) {
        if (creator?.toLowerCase() === _creator?.toLowerCase()) {
          //Fetch campaign balance
          const balance = (await readContract(contractAddress, 'getBalance', [
            _campaignId,
          ])) as bigint

          allCampaigns.push({
            campaignId: _campaignId,
            creator: _creator,
            name,
            balance: balance?.toString(),
          })
        }

        continue
      }

      //Fetch campaign balance
      const balance = (await readContract(contractAddress, 'getBalance', [
        _campaignId,
      ])) as bigint

      allCampaigns.push({
        campaignId: _campaignId,
        creator: _creator,
        name,
        balance: balance?.toString(),
      })
    }

    return { status: 200, data: allCampaigns }
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.error(`Error getting contract ${contractAddress}: ${e}`)
    }
    return {
      status: 500,
      error: (e as Error)?.message,
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

const getWithCampaignId = async ({
  campaignId,
  contractAddress,
}: CampaignGetRequest): Promise<CampaignGetResponse> => {
  try {
    const logs = await indexContractEvents(contractAddress)

    if (!logs || !logs.length) {
      return { status: 200, error: 'No logs found' }
    }

    const [data] = logs.reduce((acc, log: Log) => {
      const { campaignId: logCampaignId, creator, name } = log.args

      if (campaignId === logCampaignId) {
        acc.push({ campaignId: logCampaignId, creator, name })
      }
      return acc
    }, [] as Partial<Campaign>[])

    if (!data) {
      return { status: 404, error: 'Campaign not found' }
    }

    //Fetch campaign balance
    const balance = (await readContract(contractAddress, 'getBalance', [
      campaignId,
    ])) as bigint

    return {
      status: 200,
      data: { ...data, balance: balance?.toString() } as Campaign,
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.error(`Error getting contract ${contractAddress}: ${e}`)
    }
    return {
      status: 500,
      error: (e as Error)?.message,
    }
  }
}

export default { getWithCampaignId, getCampaigns }

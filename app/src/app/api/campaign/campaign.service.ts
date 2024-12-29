import logger from '@/app/lib/logger'
import { EventNames, indexContractEvents, readContract } from '@/lib/indexer'
import Campaign, { CampaignInterface } from '@/../db/models/campaign-model'
import CampaignContract from '@/../db/models/campaignContract-model'
import DonationEvent from '@/../db/models/donationEvent-model'
import { getPublicClient } from 'wagmi/actions'
import { wagmiProviderConfig } from '@/lib/chains'

export interface Campaign {
  campaignId: string
  creator: string
  name: string
  balance: string
}

interface indexContractPostRequest {
  contractAddress: string
  chainId: number
}

interface indexContractPostResponse {
  error?: string
  status: number
}

const indexContract = async ({
  contractAddress,
  chainId,
}: indexContractPostRequest): Promise<indexContractPostResponse> => {
  try {
    let latestBlockUpdate = 0

    const client = getPublicClient(wagmiProviderConfig)
    if (!client) throw new Error('Error retrieving public client')

    const latestBlock = await client.getBlockNumber()

    // Fetch campaign contract from db
    const campaignContract = await CampaignContract.findOne({
      contractAddress,
      chainId,
    })

    // Fetch all cached campaigns from db
    const cachedCampaigns = await Campaign.find({
      contractAddress,
      chainId,
    }).lean()

    if (campaignContract) {
      latestBlockUpdate = campaignContract.latestBlockUpdate
    }

    logger.debug(`Latest block: ${latestBlock}`)
    logger.debug(`Cached campaigns: ${cachedCampaigns?.length}`)

    const [fetchedCampaigns, donations] = await Promise.all([
      indexContractEvents({
        contractAddress,
        event: EventNames.Create,
        fromBlock: BigInt(latestBlockUpdate),
        toBlock: latestBlock,
      }),
      indexContractEvents({
        contractAddress,
        event: EventNames.Donate,
        fromBlock: BigInt(latestBlockUpdate),
        toBlock: latestBlock,
      }),
    ])

    logger.debug(`Fetched campaigns: ${fetchedCampaigns?.length}`)
    const newCampaigns = [] as CampaignInterface[]

    // Parse all new campaigns and fetch their balances
    if (!!fetchedCampaigns && fetchedCampaigns.length) {
      const fetchedCampaignBalances = await Promise.all(
        [...fetchedCampaigns].map((log) => {
          // @ts-expect-error: Checking if creator exist below so safe to ignore
          const { campaignId: _campaignId } = log?.args
          return readContract(contractAddress, 'getBalance', [_campaignId])
        })
      )

      // Update balances for cached campaigns
      fetchedCampaigns.forEach((log, i) => {
        const balance = fetchedCampaignBalances[i] as bigint | undefined

        // @ts-expect-error: Checking if creator exist below so safe to ignore
        const { campaignId: _campaignId, creator: _creator, name } = log?.args

        newCampaigns.push({
          contractAddress,
          chainId,
          campaignId: _campaignId,
          creator: _creator,
          name: name,
          balance: BigInt(balance || 0),
          latestBlockUpdate: Number(latestBlock),
        })
      })
    }

    logger.debug(`Fetchin balances.`)
    // Fetch all balances for the cached campaigns
    const cachedCampaignBalances = await Promise.all(
      [...cachedCampaigns].map(({ campaignId }) => {
        return readContract(contractAddress, 'getBalance', [campaignId])
      })
    )

    // Update balances for cached campaigns
    const updatedCachedCampaigns = cachedCampaigns.map((campaign, i) => {
      const balance = cachedCampaignBalances[i] as bigint | undefined

      return {
        ...campaign,
        balance: balance || BigInt(0),
      }
    })

    // Delete all existing logs with the same contract address and chainId
    await Campaign.deleteMany()
    await Campaign.insertMany([
      ...(newCampaigns || []),
      ...(updatedCachedCampaigns || []),
    ])

    // Parse dontation events
    if (donations && donations.length) {
      const donationBlocks = await Promise.all(
        donations.map(({ blockNumber }) => {
          return client.getBlock({ blockNumber })
        })
      )

      const donationTimestampsMap = new Map(
        donationBlocks.map((b) => [b.number, Number(b.timestamp)])
      )

      const donationsToInsert = donations.map((log) => {
        // @ts-expect-error: Checking if creator exist below so safe to ignore
        const { campaignId, donor, amount } = log?.args
        return {
          contractAddress,
          chainId,
          campaignId,
          fromAddress: donor,
          amount: BigInt(amount),
          timestamp: donationTimestampsMap.get(log.blockNumber),
          blockNumber: Number(log.blockNumber),
        }
      })

      //Add donation events to db
      await DonationEvent.insertMany(donationsToInsert)
    }

    if (campaignContract) {
      logger.debug(`Updating contract ${contractAddress}`)
      await CampaignContract.updateOne(
        {
          contractAddress,
          chainId,
        },
        {
          latestBlockUpdate: Number(latestBlock),
        }
      )
    } else {
      logger.debug(`Creating contract ${contractAddress}`)
      await CampaignContract.create({
        contractAddress,
        chainId,
        latestBlockUpdate: Number(latestBlock),
      })
    }

    return { status: 200 }
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

interface CampaignsGetRequest {
  contractAddress: string
  creator?: string
  chainId: number
}

interface CampaignsGetResponse {
  data?: Campaign[]
  error?: string
  status: number
}

const getCampaigns = async ({
  contractAddress,
  creator,
  chainId,
}: CampaignsGetRequest): Promise<CampaignsGetResponse> => {
  try {
    const creatorQuery: object = creator ? { creator } : {}

    const logs = await Campaign.find({
      contractAddress,
      chainId,
      ...creatorQuery,
    })

    return { status: 200, data: logs }
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
  chainId: number
}

interface CampaignGetResponse {
  data?: Campaign
  error?: string
  status: number
}

const getWithCampaignId = async ({
  campaignId,
  contractAddress,
  chainId,
}: CampaignGetRequest): Promise<CampaignGetResponse> => {
  try {
    const campaignIdQuery: object = campaignId ? { campaignId } : {}

    const logs = await Campaign.findOne({
      contractAddress,
      chainId,
      ...campaignIdQuery,
    })

    return {
      status: 200,
      data: logs,
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

export default { getWithCampaignId, getCampaigns, indexContract }

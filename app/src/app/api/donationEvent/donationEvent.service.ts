import { z } from 'zod'
import logger from '@/app/lib/logger'
import { chainIdToViemChain } from '@/lib/chains'
import DonationEvent from '@/../db/models/donationEvent-model'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import Campaign from '@/../db/models/campaign-model'
import { Chain } from '@/app/lib/chains'

const donationFilterSchema = z.object({
  timestamp: z.object({
    from: z.coerce.number(),
    to: z.coerce.number(),
  }),
})

export const donationFilterSchemaByCampaignIdSchema =
  donationFilterSchema.extend({
    campaignId: z.string(),
  })
export type DonationFilterByCampaignId = z.infer<
  typeof donationFilterSchemaByCampaignIdSchema
>

export const donationFiltersByAddressSchema = donationFilterSchema.extend({
  address: z.string(),
})
export type DonationFiltersByAddress = z.infer<
  typeof donationFiltersByAddressSchema
>

async function getDonationEventsByCampaignId(
  chainId: Chain,
  { timestamp, campaignId }: DonationFilterByCampaignId
) {
  try {
    const contractAddress = getCampaignDeploymentAddress(chainId)
    const chain = chainIdToViemChain(Number(chainId))

    if (!chain) {
      return { status: 400, error: 'Invalid chain' }
    }

    const events = await DonationEvent.find({
      campaignId,
      contractAddress,
      timestamp: {
        $gte: timestamp.from,
        $lte: timestamp.to,
      },
    })

    return { status: 200, data: events }
  } catch (e: unknown) {
    logger.error(`Error getting donation events: ${e}`)

    if (e instanceof Error) {
      return { status: 400, error: e.message }
    }

    return { status: 400, error: 'Unknown error' }
  }
}

async function getDonationEventsByUserAddress(
  chainId: Chain,
  { timestamp, address }: DonationFiltersByAddress
) {
  try {
    const chain = chainIdToViemChain(Number(chainId))

    if (!chain) {
      return { status: 400, error: 'Invalid chain' }
    }

    // TODO: once membership indexer is implemented, filter campaigns that user is member of. For now, we get all campaigns that the user has created
    const contracts = await Campaign.find({
      creator: address,
    })

    const events = await DonationEvent.find({
      contractAddress: { $in: contracts.map((c) => c.contractAddress) },
      timestamp: {
        $gte: timestamp.from,
        $lte: timestamp.to,
      },
    })

    return { status: 200, data: events }
  } catch (e: unknown) {
    logger.error(`Error getting donation events: ${e}`)

    if (e instanceof Error) {
      return { status: 400, error: e.message }
    }

    return { status: 400, error: 'Unknown error' }
  }
}

export default { getDonationEventsByCampaignId, getDonationEventsByUserAddress }

import { z } from 'zod'
import logger from '@/app/lib/logger'
import { chainIdToViemChain } from '@/lib/chains'
import DonationEvent from '@/../db/models/donationEvent-model'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { Chain } from '@/app/lib/chains'

export const donationFilterSchema = z.object({
  startsAt: z.coerce.number(),
  endsAt: z.coerce.number(),
})

export type DonationFilter = z.infer<typeof donationFilterSchema>

async function getDonationEventsByCampaignId(
  chainId: Chain,
  campaignId: string,
  { startsAt, endsAt }: DonationFilter
) {
  try {
    const contractAddress = getCampaignDeploymentAddress(chainId)
    const chain = chainIdToViemChain(Number(chainId))

    if (!chain) {
      return { status: 400, error: 'Invalid chain' }
    }

    const events = await DonationEvent.find({
      chainId,
      campaignId,
      contractAddress,
      timestamp: {
        $gte: startsAt,
        $lte: endsAt,
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

export default { getDonationEventsByCampaignId }

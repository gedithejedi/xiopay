import { z } from 'zod'
import logger from '@/app/lib/logger'
import { chainIdToViemChain } from '@/lib/chains'
import WithdrawEvent from '@/../db/models/withdrawEvent-model'
import Campaign from '@/../db/models/campaign-model'
import { Chain } from '@/app/lib/chains'

const withdrawalFilterSchema = z.object({
  timestamp: z.object({
    from: z.coerce.number(),
    to: z.coerce.number(),
  }),
})

export const withdrawalFiltersByAddressSchema = withdrawalFilterSchema.extend({
  address: z.string(),
})
export type WithdrawFiltersByAddress = z.infer<
  typeof withdrawalFiltersByAddressSchema
>

async function getWithdrawEventsByUserAddress(chainId: Chain, address: string) {
  try {
    const chain = chainIdToViemChain(Number(chainId))

    if (!chain) {
      return { status: 400, error: 'Invalid chain' }
    }

    const contracts = await Campaign.find({
      creator: address,
    })

    const events = await WithdrawEvent.find({
      contractAddress: { $in: contracts.map((c) => c.contractAddress) },
    })

    return { status: 200, data: events }
  } catch (e: unknown) {
    logger.error(`Error getting withdraw events: ${e}`)

    if (e instanceof Error) {
      return { status: 400, error: e.message }
    }

    return { status: 400, error: 'Unknown error' }
  }
}

export default { getWithdrawEventsByUserAddress }

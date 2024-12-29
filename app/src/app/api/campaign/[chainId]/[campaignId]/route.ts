import logger from '@/app/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import CampaignService from '../../campaign.service'
import dbConnect from '@/app/lib/mongo'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { chainsInString } from '@/app/lib/chains'
import { z } from 'zod'

const paramsSchema = z.object({
  campaignId: z.string(),
  chainId: z.enum(chainsInString).transform((chainId) => Number(chainId)),
})

export async function GET(
  _: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const params = await context.params
  const { campaignId, chainId } = paramsSchema.parse(params)
  const contractAddress = getCampaignDeploymentAddress(chainId)

  if (!campaignId || !contractAddress) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  await dbConnect()
  logger.info(`Indexing transactions for ${campaignId} on ${contractAddress}`)

  const { error, status, data } = await CampaignService.getWithCampaignId({
    campaignId,
    contractAddress,
    chainId,
  })

  if (error) {
    return NextResponse.json({
      error,
      status,
    })
  }

  return NextResponse.json({
    status,
    data,
  })
}

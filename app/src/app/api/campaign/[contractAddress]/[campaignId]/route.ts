import logger from '@/app/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import CampaignService from '../../campaign.service'

interface GetParams {
  campaignId: string
  contractAddress: string
}

export async function GET(_: NextRequest, context: { params: GetParams }) {
  const { campaignId, contractAddress } = context.params

  if (!campaignId || !contractAddress) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  logger.info(`Indexing transactions for ${campaignId} on ${contractAddress}`)

  const { error, status, data } = await CampaignService.getWithCampaignId({
    campaignId,
    contractAddress,
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
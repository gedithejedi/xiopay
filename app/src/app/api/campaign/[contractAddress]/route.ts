import logger from '@/app/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import CampaignService from '../campaign.service'

interface GetParams {
  contractAddress: string
}

export async function GET(
  request: NextRequest,
  context: { params: GetParams }
) {
  const { contractAddress } = await context.params
  const creator = request.nextUrl.searchParams.get('creator')

  if (!contractAddress) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  if (!creator) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  logger.info(`Indexing transactions on ${contractAddress}`)

  const { error, status, data } = await CampaignService.getCampaigns({
    contractAddress,
    creator,
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

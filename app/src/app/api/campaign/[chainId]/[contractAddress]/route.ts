import logger from '@/app/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import CampaignService from '../../campaign.service'
import dbConnect from '@/app/lib/mongo'

interface GetParams {
  contractAddress: string
  chainId: string
}

export async function GET(
  request: NextRequest,
  context: { params: GetParams }
) {
  const { contractAddress, chainId } = await context.params
  const creator = request.nextUrl.searchParams.get('creator')

  if (!contractAddress || !chainId) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  if (!creator) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  await dbConnect()

  const { error, status, data } = await CampaignService.getCampaigns({
    contractAddress,
    creator,
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

export async function POST(
  request: NextRequest,
  context: { params: GetParams }
) {
  const { contractAddress, chainId } = await context.params

  if (!contractAddress || !chainId) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  await dbConnect()
  logger.info(`Indexing transactions on ${contractAddress}`)

  const { error, status } = await CampaignService.indexContract({
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
  })
}

import logger from '@/app/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import DonationService, { DonationPermitData } from '../../../donate.service'

interface PostParams {
  campaignId: string
  contractAddress: string
  chainId: string
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<PostParams> }
) {
  console.log('POST /api/donate/[chainId]/[contractAddress]/[campaignId]')
  const { campaignId, contractAddress, chainId } = await context.params
  const { params } = await request.json()

  console.log(params)

  if (!campaignId || !contractAddress || !params || !chainId) {
    return NextResponse.json({ error: 'Missing args' }, { status: 404 })
  }

  logger.info(
    `Processing donation for ${campaignId} on ${contractAddress} on chain ${chainId}`
  )

  const { error, status, data } = await DonationService.postDonation({
    campaignId,
    contractAddress,
    chainId,
    txData: JSON.parse(params) as DonationPermitData,
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

import logger from '@/app/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import CampaignService from '../campaign.service'
import dbConnect from '@/app/lib/mongo'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { chainsInString } from '@/app/lib/chains'
import { z } from 'zod'

const paramsSchema = z.object({
  chainId: z.enum(chainsInString).transform((chainId) => Number(chainId)),
})
type Params = z.infer<typeof paramsSchema>

export async function GET(request: NextRequest, context: { params: Params }) {
  const params = await context.params
  const { chainId } = paramsSchema.parse(params)
  const contractAddress = getCampaignDeploymentAddress(chainId)
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

export async function POST(request: NextRequest, context: { params: Params }) {
  const params = await context.params
  const { chainId } = paramsSchema.parse(params)
  const contractAddress = getCampaignDeploymentAddress(chainId)

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

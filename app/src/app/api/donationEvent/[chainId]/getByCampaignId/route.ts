import { NextRequest, NextResponse } from 'next/server'
import DonationEventService, {
  donationFilterSchemaByCampaignIdSchema,
} from '@/app/api/donationEvent/donationEvent.service'
import { chainIdObjectSchema, ChainIdObject } from '@/app/api/schema'

export async function GET(
  request: NextRequest,
  context: { params: Promise<ChainIdObject> }
) {
  const params = await context.params
  const { chainId } = chainIdObjectSchema.parse(params)
  const rawFilters = await request.json()
  const filters = donationFilterSchemaByCampaignIdSchema.parse(rawFilters)

  const { error, status, data } =
    await DonationEventService.getDonationEventsByCampaignId(chainId, filters)

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

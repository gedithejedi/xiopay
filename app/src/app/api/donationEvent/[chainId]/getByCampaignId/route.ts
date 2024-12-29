import { NextRequest, NextResponse } from 'next/server'
import DonationEventService, {
  donationFilterSchemaByCampaignIdSchema,
  DonationFilterByCampaignId,
} from '@/app/api/donationEvent/donationEvent.service'

export async function GET(
  _: NextRequest,
  context: { params: DonationFilterByCampaignId }
) {
  const params = await context.params
  const parsedParams = donationFilterSchemaByCampaignIdSchema.parse(params)

  const { error, status, data } =
    await DonationEventService.getDonationEventsByCampaignId(parsedParams)

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

import { NextRequest, NextResponse } from 'next/server'
import DonationEventService, {
  donationFiltersByAddressSchema,
  DonationFiltersByAddress,
} from '@/app/api/donationEvent/donationEvent.service'

export async function GET(
  _: NextRequest,
  context: { params: Promise<DonationFiltersByAddress> }
) {
  const params = await context.params
  const parsedParams = donationFiltersByAddressSchema.parse(params)

  const { error, status, data } =
    await DonationEventService.getDonationEventsByUserAddress(parsedParams)

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

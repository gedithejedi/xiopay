import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import DonationEventService, {
  donationFilterSchema,
} from '@/app/api/donationEvent/donationEvent.service'
import { chainIdSchema } from '@/app/api/schema'

const paramsSchema = z.object({
  campaignId: z.string(),
  chainId: chainIdSchema,
})

type Params = z.infer<typeof paramsSchema>

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const params = await context.params
  const { chainId, campaignId } = paramsSchema.parse(params)

  const rawFilters = Object.fromEntries(request.nextUrl.searchParams)
  const filters = donationFilterSchema.parse(rawFilters)

  const { error, status, data } =
    await DonationEventService.getDonationEventsByCampaignId(
      chainId,
      campaignId,
      filters
    )

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

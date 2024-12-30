import { NextRequest, NextResponse } from 'next/server'
import withdrawEventService from '@/app/api/withdrawEvent/withdrawEvent.service'
import { z } from 'zod'
import { chainIdSchema } from '@/app/api/schema'

const paramsSchema = z.object({
  chainId: chainIdSchema,
  address: z.string(),
})

type Params = z.infer<typeof paramsSchema>

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const params = await context.params
  const { chainId, address } = paramsSchema.parse(params)

  const { error, status, data } =
    await withdrawEventService.getWithdrawEventsByUserAddress(chainId, address)

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

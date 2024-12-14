import { Chain } from '@/app/lib/chains'
import { NextRequest, NextResponse } from 'next/server'

export interface TransactionFilter {
  startDate?: string | undefined
  endDate?: string | undefined
}

interface Params {
  chain: Chain
  address: string
}

export async function GET(_: NextRequest, context: { params: Params }) {
  const { address } = context.params

  if (!address) {
    return NextResponse.json({
      error: 'Address is required',
      status: 200,
    })
  }

  //TODO: GO TO TransactionsService and implement getTransactions

  const data = {}

  return NextResponse.json({
    data,
    status: 200,
  })
}

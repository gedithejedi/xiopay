import { NextRequest, NextResponse } from 'next/server'

import UserService from './user.service'

// interface GetParams {
//   chain: Chain
//   address: string
// }

// export async function GET(_: NextRequest, context: { params: GetParams }) {
//   const { address } = context.params

//   if (!address) {
//     return NextResponse.json({
//       error: 'Address is required',
//       status: 200,
//     })
//   }

//   const data = {}

//   return NextResponse.json({
//     data,
//     status: 200,
//   })
// }

interface PostParams {
  dynamicUserId: string
  body: any
}

export async function POST(_: NextRequest, context: { params: PostParams }) {
  const { dynamicUserId, body } = context.params

  const { error, status } = await UserService.post(dynamicUserId, {
    body: body,
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

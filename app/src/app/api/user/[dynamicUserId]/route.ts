import { NextRequest, NextResponse } from 'next/server'

import UserService from '../user.service'
import dbConnect from '@/app/lib/mongo'

interface GetParams {
  dynamicUserId: string
}

export async function GET(_: NextRequest, context: { params: GetParams }) {
  const { dynamicUserId } = context.params
  if (!dynamicUserId) {
    return NextResponse.json({
      error: 'Dynamic id is required',
      status: 200,
    })
  }

  await dbConnect()

  const { error, status, data } = await UserService.get({ dynamicUserId })

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

interface PostParams {
  dynamicUserId: string
  body: any
}

export async function POST(_: NextRequest, context: { params: PostParams }) {
  const { dynamicUserId, body } = context.params

  await dbConnect()

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
import User, { IUserModel, UserInterface } from '@/../../db/models/user-model'
import logger from '@/app/lib/logger'
import { v4 as uuid } from 'uuid'

interface UserGetRequest {
  userId?: string
  dynamicUserId?: string
}

interface UserGetResponse {
  data?: UserInterface
  error?: string
  status: number
}

export const get = async ({
  dynamicUserId,
}: UserGetRequest): Promise<UserGetResponse> => {
  try {
    const user = await User.findOne({ dynamicUserId })
    if (!user) {
      return { status: 404, error: 'User not found' }
    }

    return { data: user, status: 200 }
  } catch (e: any) {
    logger.error(`Error getting user ${dynamicUserId}: ${e}`)
    return {
      status: 500,
      error: e?.data?.message || e?.error?.message || e.message,
    }
  }
}

interface UserPostRequest {
  body: any
}

interface UserPostResponse {
  error?: string
  status: number
}

export const post = async (
  dynamicUserId: string,
  { body }: UserPostRequest
): Promise<UserPostResponse> => {
  try {
    const doesExist = await User.find({ dynamicUserId })

    if (doesExist.length != 0) {
      return { status: 400, error: 'User already exists' }
    }

    const publicId = uuid()

    await User.create({
      dynamicUserId,
      publicId,
    })
  } catch (e: any) {
    logger.error(`Error creating user: ${e}`)
    return {
      status: 500,
      error: e?.data?.message || e?.error?.message || e.message,
    }
  }

  return { status: 201 }
}

export default { post, get }

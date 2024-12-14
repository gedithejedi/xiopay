import User, { IUserModel, UserInterface } from '@/../../db/models/user-model'
import logger from '@/app/lib/logger'

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
  const { orgName } = body

  try {
    const doesExist = await User.find({ dynamicUserId })

    if (doesExist.length != 0) {
      return { status: 400, error: 'User already exists' }
    }
    await User.create({
      dynamicUserId,
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

export default { post }

import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface User {
  dynamicUserId: string
  publicId: string
  pageLink: string
  avatar: string
  updatedAt?: number
}

type GetUserResult = User | null

export const getUser = async ({
  dynamicUserId,
}: {
  dynamicUserId: string
}): Promise<GetUserResult> => {
  try {
    if (!dynamicUserId) throw new Error('No id provided.')
    const apiUrl = `/api/user/${dynamicUserId}`
    const { data } = await axios.get(apiUrl)

    return data
  } catch (error: unknown) {
    console.error(error)
    return null
  }
}

export const useGetUser = ({
  dynamicUserId,
  config = {},
}: {
  dynamicUserId: string
  config?: Omit<
    UseQueryOptions<GetUserResult, Error, GetUserResult>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}) => {
  return useQuery<GetUserResult, Error>({
    queryKey: ['user', dynamicUserId],
    queryFn: () => getUser({ dynamicUserId }),
    enabled: !!dynamicUserId,
    staleTime: 300000,
    ...config,
  })
}

import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface User {
  dynamicUserId: string
  publicId: string
  pageLink: string
  avatar: string
  updatedAt?: number
  campaigns?: any[]
}

export const getUser = async ({
  dynamicUserId,
}: {
  dynamicUserId: string
}): Promise<User | any> => {
  try {
    if (!dynamicUserId) throw new Error('No id provided.')
    const apiUrl = `/api/user/${dynamicUserId}`
    const { data } = await axios.get(apiUrl)

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { message: error.message, status: error.response?.status }
    } else {
      return { message: 'An unexpected error occurred' }
    }
  }
}

export const useGetUser = ({
  dynamicUserId,
  config = {},
}: {
  dynamicUserId: string
  config?: Omit<UseQueryOptions<User, Error>, 'queryKey'>
}) => {
  return useQuery<User, Error>({
    queryKey: ['user', dynamicUserId],
    queryFn: () => getUser({ dynamicUserId }),
    enabled: !!dynamicUserId,
    staleTime: 300000,
    ...config,
  })
}

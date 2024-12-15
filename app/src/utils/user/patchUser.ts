import { useMutation, useQueryClient } from '@tanstack/react-query'

import { User } from './getUser'
import axios from 'axios'

export const patchUser = async ({
  userId,
  data,
  removeData,
}: {
  userId: string
  data?: User
  removeData?: User
}): Promise<void> => {
  const apiUrl = `/user/${userId}`
  return axios.patch(apiUrl, { ...data, removeData })
}

export const usePatchUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      data,
      removeData,
    }: {
      userId: string
      data?: User
      removeData?: User
    }) => patchUser({ userId, data, removeData }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  })
}

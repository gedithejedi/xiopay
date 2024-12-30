import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { WithdrawEventInterface } from '../../../db/models/withdrawEvent-model'

type getWithdrawEventByUserAddressResult = WithdrawEventInterface[]

export const getWithdrawEventByUserAddress = async ({
  chainId,
  address,
}: {
  chainId: number
  address: string
}): Promise<getWithdrawEventByUserAddressResult> => {
  try {
    const apiUrl = `/api/withdrawEvent/${chainId}/address/${address}`
    const { data } = await axios.get(apiUrl)

    return data.data
  } catch (error: unknown) {
    console.error(error)
    return []
  }
}

export const useGetWithdrawEventByUserAddress = ({
  chainId,
  address,
  config = {},
}: {
  chainId: number
  address: string
  config?: Omit<
    UseQueryOptions<
      getWithdrawEventByUserAddressResult,
      Error,
      getWithdrawEventByUserAddressResult
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >
}) => {
  return useQuery<getWithdrawEventByUserAddressResult, Error>({
    queryKey: ['withdraw', chainId, address],
    queryFn: () => getWithdrawEventByUserAddress({ chainId, address }),
    enabled: !!address && !!chainId,
    ...config,
  })
}

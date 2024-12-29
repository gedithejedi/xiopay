import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { DonationEventInterface } from '@/../db/models/donationEvent-model'
import { DonationFiltersByAddress } from '@/app/api/donationEvent/donationEvent.service'

type GetDonationEventsByUserAddressResult = DonationEventInterface | null

export const getDonationEventsByUserAddress = async ({
  chainId,
  filters,
}: {
  chainId: number
  filters: DonationFiltersByAddress
}): Promise<GetDonationEventsByUserAddressResult> => {
  try {
    const apiUrl = `/api/donationEvent/${chainId}/getByUserAddress`
    const { data } = await axios.get(apiUrl, {
      data: filters,
    })

    return data.data
  } catch (error: unknown) {
    console.error(error)
    return null
  }
}

export const useGetDonationEventsByUserAddress = ({
  chainId,
  filters,
  config = {},
}: {
  chainId: number
  filters: DonationFiltersByAddress
  config?: Omit<
    UseQueryOptions<
      GetDonationEventsByUserAddressResult,
      Error,
      GetDonationEventsByUserAddressResult
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >
}) => {
  return useQuery<GetDonationEventsByUserAddressResult, Error>({
    queryKey: ['campaign', chainId],
    queryFn: () => getDonationEventsByUserAddress({ chainId, filters }),
    ...config,
  })
}

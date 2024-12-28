import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export const indexCampaigns = async ({
  contractAddress,
  chainId,
}: {
  contractAddress: string
  chainId: string
}): Promise<boolean> => {
  try {
    const apiUrl = `/api/campaign/${chainId}/${contractAddress}`
    await axios.post(apiUrl)

    return true
  } catch (error: any) {
    console.error(error)
    toast.error('Something went wrong while indexing campaigns.')
    return true
  }
}

const useIndexCampaigns = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      contractAddress,
      chainId,
    }: {
      contractAddress: string
      chainId: string
    }) => indexCampaigns({ contractAddress, chainId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['campaign', 'contractAddress'],
      }),
  })
}

export default useIndexCampaigns

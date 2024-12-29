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
  const toastId = toast.loading('Indeixing contract...')
  try {
    const apiUrl = `/api/campaign/${chainId}/${contractAddress}`
    await axios.post(apiUrl)

    toast.success('Campaigns indexed successfully.', { id: toastId })
    return true
  } catch (error: unknown) {
    console.error(error)

    toast.error('Something went wrong while indexing campaigns.', {
      id: toastId,
    })
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
    onSuccess: (_, { contractAddress, chainId }) => {
      queryClient.invalidateQueries({
        queryKey: ['campaign', chainId, contractAddress],
      })
    },
  })
}

export default useIndexCampaigns

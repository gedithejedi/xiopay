import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export const indexCampaigns = async ({
  chainId,
  enableToast = false,
}: {
  chainId: number
  enableToast?: boolean
}): Promise<boolean> => {
  const toastId = enableToast
    ? toast.loading('Indexing contract...')
    : undefined
  try {
    const apiUrl = `/api/campaign/${chainId}`
    await axios.post(apiUrl)

    toastId
      ? toast.success('Campaigns indexed successfully.', { id: toastId })
      : null
    return true
  } catch (error: unknown) {
    console.error(error)

    toastId
      ? toast.error('Something went wrong while indexing campaigns.', {
          id: toastId,
        })
      : null
    return true
  }
}

const useIndexCampaigns = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chainId,
      enableToast,
    }: {
      chainId: number
      enableToast?: boolean
    }) => indexCampaigns({ chainId, enableToast }),
    onSuccess: (_, { chainId }) => {
      queryClient.invalidateQueries({
        queryKey: ['campaign', chainId],
      })
    },
  })
}

export default useIndexCampaigns

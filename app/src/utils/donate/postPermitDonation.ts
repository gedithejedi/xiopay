import axios from 'axios'

export interface PostPermitDonationParams {
  owner: string
  spender: string
  value: bigint
  deadline: bigint
  v: number
  r: string
  s: string
  tokenAddress: string
  chainId: number
}

export const postPermitDonation = async ({
  campaignId,
  contractAddress,
  chainId,
  txData,
}: {
  campaignId: string
  contractAddress: string
  chainId: string
  txData: PostPermitDonationParams
}) => {
  try {
    const apiUrl = `/api/donate/${chainId}/${contractAddress}/${campaignId}`
    const headers = { 'Content-Type': 'application/json' }

    const response = await axios.post(apiUrl, {
      headers,
      params: JSON.stringify({
        ...txData,
        deadline: txData.deadline.toString(),
        value: txData.value.toString(),
      }),
    })

    return response
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error)
    }

    console.error(error)
    throw error
  }
}

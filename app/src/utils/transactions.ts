import { wagmiProviderConfig } from '@/lib/chains'
import toast from 'react-hot-toast'
import { Abi } from 'viem'
import {
  getPublicClient,
  getWalletClient,
  waitForTransactionReceipt,
} from 'wagmi/actions'

export const createCampaign = async ({
  name,
  contractAddress,
  abi,
}: {
  name: string
  contractAddress: string
  abi: Abi
}) => {
  const toastId = toast.loading('Creating you campaign...')

  try {
    const walletClient = await getWalletClient(wagmiProviderConfig)
    const account = walletClient.account.address
    const client = getPublicClient(wagmiProviderConfig)
    if (!client || !walletClient)
      throw new Error('Error retrieving public client')

    const unwrapArgs = {
      account,
      address: contractAddress as `0x${string}`,
      abi: abi as Abi,
      args: [name],
      functionName: 'createCampaign',
    }

    const res = await client.simulateContract(unwrapArgs)
    if (!res?.request) throw new Error('Something went wrong while simulating.')

    const hash = await walletClient.writeContract(res?.request)
    const receipt = await waitForTransactionReceipt(wagmiProviderConfig, {
      hash,
    })

    toast.success('Successfully created you campaign.', { id: toastId })

    return receipt
  } catch (e: any) {
    console.error(e)
    toast.error('Something went wrong in contract execution', { id: toastId })
    return
  }
}

export const donateToCampaign = async ({
  amount,
  contractAddress,
  campaignId,
  abi,
  permit,
}: {
  amount: bigint
  contractAddress: string
  campaignId: string
  abi: Abi
  permit: {
    deadline: number
    v: number
    r: string
    s: string
  }
}) => {
  const toastId = toast.loading('Donating...')

  try {
    const walletClient = await getWalletClient(wagmiProviderConfig)
    const account = walletClient.account.address
    const client = getPublicClient(wagmiProviderConfig)
    if (!client || !walletClient)
      throw new Error('Error retrieving public client')

    const { deadline, v, r, s } = permit

    const unwrapArgs = {
      account,
      address: contractAddress as `0x${string}`,
      abi: abi as Abi,
      args: [campaignId, amount, deadline, v, r, s],
      functionName: 'donateWithPermit',
    }

    const res = await client.simulateContract(unwrapArgs)
    if (!res?.request) throw new Error('Something went wrong while donating.')

    const hash = await walletClient.writeContract(res?.request)
    const receipt = await waitForTransactionReceipt(wagmiProviderConfig, {
      hash,
    })

    toast.success('Successfully donated.', { id: toastId })

    return receipt
  } catch (e: any) {
    console.error(e)
    toast.error('Something went wrong while donating', { id: toastId })
    return
  }
}

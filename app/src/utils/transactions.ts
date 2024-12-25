import { wagmiProviderConfig } from '@/lib/chains'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { Abi } from 'viem'
import customErc20Ai from '@/constants/abi/token.json'
import {
  getPublicClient,
  getWalletClient,
  signTypedData,
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
    console.log(unwrapArgs)
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

    const donateArgs = {
      account,
      address: contractAddress as `0x${string}`,
      abi: abi as Abi,
      args: [campaignId, amount, deadline, v, r, s],
      functionName: 'donateWithPermit',
    }

    const res = await client.simulateContract(donateArgs)
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

export interface PermitData {
  chainId: number
  tokenAddress: string
  account: string
  toAddress: string
  amount: bigint
}

export const types = {
  Permit: [
    {
      name: 'owner',
      type: 'address',
    },
    {
      name: 'spender',
      type: 'address',
    },
    {
      name: 'value',
      type: 'uint256',
    },
    {
      name: 'nonce',
      type: 'uint256',
    },
    {
      name: 'deadline',
      type: 'uint256',
    },
  ],
}

export const getPermit = async (data: PermitData) => {
  try {
    const walletClient = await getWalletClient(wagmiProviderConfig)
    const publicClient = getPublicClient(wagmiProviderConfig)

    const { tokenAddress, chainId, account, toAddress, amount } = data

    if (!walletClient || !publicClient)
      return console.error('Error retrieving clients')

    const deadline = dayjs().add(86400, 'seconds').unix()

    try {
      await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: customErc20Ai,
        functionName: 'nonces',
        args: [account as `0x${string}`],
      })
    } catch (e) {
      console.error(e)
    }

    const nonces = await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: customErc20Ai,
      functionName: 'nonces',
      args: [account as `0x${string}`],
    })

    const name = (await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: customErc20Ai,
      functionName: 'name',
    })) as string

    const domain = {
      name,
      version: '2',
      chainId,
      verifyingContract: tokenAddress as `0x${string}`,
    }

    const values = {
      owner: account,
      spender: toAddress,
      value: amount,
      nonce: nonces,
      deadline,
    }

    try {
      const signature = await signTypedData(wagmiProviderConfig, {
        domain,
        types,
        primaryType: 'Permit',
        message: values,
      })

      if (!signature) throw new Error('Error signing permit')

      // Split signature
      const r = signature.slice(0, 66)
      const s = `0x${signature.slice(66, 130)}`
      const v = Number(`0x${signature.slice(130, 132)}`)

      return {
        owner: account,
        spender: toAddress,
        value: amount,
        deadline: BigInt(deadline),
        v,
        r,
        s,
        tokenAddress,
        chainId,
      }
    } catch (error: any) {
      console.error(error)
      toast.error('Something went wrong while signing the permit.')
      return
    }
  } catch (error) {
    console.error(error)
  }
}

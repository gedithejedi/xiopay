import { wagmiProviderConfig } from '@/lib/chains'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { Abi, parseSignature } from 'viem'
import customErc20Ai from '@/constants/abi/token.json'
import {
  getPublicClient,
  getWalletClient,
  signTypedData,
  waitForTransactionReceipt,
} from 'wagmi/actions'
import { getCampaignDeploymentAddress } from '@/constants/contract/deployAddresses'
import { Chain } from '@/app/lib/chains'

export const createCampaign = async ({
  name,
  abi,
  chainId,
}: {
  name: string
  abi: Abi
  chainId: Chain
}) => {
  const toastId = toast.loading('Creating you campaign...')
  const contractAddress = getCampaignDeploymentAddress(chainId)
  if (!contractAddress || !contractAddress.length) {
    throw new Error('Contract address not found')
  }

  try {
    const walletClient = await getWalletClient(wagmiProviderConfig)
    const account = walletClient.account.address
    const client = getPublicClient(wagmiProviderConfig)
    if (!client || !walletClient)
      throw new Error('Error retrieving public client')

    const createArgs = {
      account,
      address: contractAddress as `0x${string}`,
      abi: abi as Abi,
      args: [name],
      functionName: 'createCampaign',
    }

    const res = await client.simulateContract(createArgs)
    if (!res?.request) throw new Error('Something went wrong while simulating.')

    const hash = await walletClient.writeContract(res?.request)
    const receipt = await waitForTransactionReceipt(wagmiProviderConfig, {
      hash,
    })

    toast.success('Successfully created you campaign.', { id: toastId })

    return receipt
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e)
      toast.error('Something went wrong in contract execution', { id: toastId })
      return
    }

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
    owner: string
    spender: string
    value: bigint
    deadline: bigint
    v: bigint | undefined
    r: `0x${string}`
    s: `0x${string}`
    tokenAddress: string
    chainId: number
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
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e)
      toast.error('Something went wrong while donating', { id: toastId })
      return
    }

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
      version: '1',
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
      const { r, s, v } = parseSignature(signature)

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
    } catch (error: unknown) {
      console.error(error)
      toast.error('Something went wrong while signing the permit.')
      return
    }
  } catch (error) {
    console.error(error)
  }
}

export const withdrawCampaign = async ({
  campaignId,
  abi,
  contractAddress,
  amount,
}: {
  contractAddress: string
  campaignId: string
  abi: Abi
  amount: bigint
}) => {
  const toastId = toast.loading('Withdrawing funds...')

  if (!contractAddress || !contractAddress.length) {
    throw new Error('Contract address not found')
  }

  try {
    const walletClient = await getWalletClient(wagmiProviderConfig)
    const account = walletClient.account.address
    const client = getPublicClient(wagmiProviderConfig)
    if (!client || !walletClient)
      throw new Error('Error retrieving public client')

    const withdrawArgs = {
      account,
      address: contractAddress as `0x${string}`,
      abi: abi as Abi,
      args: [campaignId, amount],
      functionName: 'withdraw',
    }

    const res = await client.simulateContract(withdrawArgs)
    if (!res?.request)
      throw new Error('Something went wrong while simulating withdrawal.')

    const hash = await walletClient.writeContract(res?.request)
    const receipt = await waitForTransactionReceipt(wagmiProviderConfig, {
      hash,
    })

    toast.success('Successfully withrdrawn from campaign.', { id: toastId })

    return receipt
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e)
      toast.error('Something went wrong in withdrawing execution', {
        id: toastId,
      })
      return
    }

    console.error(e)
    toast.error('Something went wrong in withdrawing contract', { id: toastId })
    return
  }
}

import logger from '@/app/lib/logger'
import { chainIdToViemChain } from '@/lib/chains'
import { createWalletClient } from 'viem'
import { TransactionReceipt } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import campaignAbi from '@/constants/abi/campaign.json'
import { createPublicClient } from 'viem'
import { http } from 'viem'
// import { waitForTransactionReceipt } from 'wagmi/actions'

export interface DonationPermitData {
  owner: string
  spender: string
  value: bigint
  deadline: bigint
  v: number
  r: string
  s: string
  tokenAddress: string
  chainId: string
}

interface DonationPostRequest {
  contractAddress: string
  campaignId: string
  chainId: string
  txData: DonationPermitData
}

interface DonationPostResponse {
  data?: TransactionReceipt
  error?: string
  status: number
}

export const postDonation = async ({
  contractAddress,
  campaignId,
  chainId,
  txData,
}: DonationPostRequest): Promise<DonationPostResponse> => {
  try {
    const account = privateKeyToAccount(
      process.env.DEPLOYER_PK as `0x${string}`
    )
    console.log(account)
    if (!account) {
      return { status: 400, error: 'Invalid account' }
    }

    const chain = chainIdToViemChain(Number(chainId))

    if (!chain) {
      return { status: 400, error: 'Invalid chain' }
    }

    const client = createWalletClient({
      account,
      chain,
      transport: http(),
    })

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    if (!publicClient || !client) {
      return { status: 400, error: 'Invalid client' }
    }

    logger.info(
      'Finished setting up client and providers. Processing donation.'
    )

    const { deadline, v, r, s, value: amount } = txData

    const res = await publicClient.simulateContract({
      address: contractAddress as `0x${string}`,
      abi: campaignAbi,
      args: [campaignId, BigInt(amount), BigInt(deadline), BigInt(v), r, s],
      functionName: 'donateWithPermit',
    })
    if (!res?.request) throw new Error('Something went wrong while donating.')

    // const hash = await client.writeContract(res?.request)
    // console.log('hash', hash)
    // const receipt = await waitForTransactionReceipt(publicClient, {
    //   hash,
    // })
    // console.log('receipt', receipt)

    // return { status: 200, data: receipt }
    return { status: 200 }
  } catch (e: unknown) {
    logger.error(`Error executing a permit tx ${contractAddress}: ${e}`)

    if (e instanceof Error) {
      return { status: 400, error: e.message }
    }

    return { status: 400, error: 'Unknown error' }
  }
}

export default { postDonation }

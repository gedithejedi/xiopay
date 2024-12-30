import { wagmiProviderConfig } from '@/lib/chains'
import { Abi, AbiEvent, GetLogsReturnType } from 'viem'
import { getPublicClient } from 'wagmi/actions'
import CampaignAbi from '@/constants/abi/campaign.json'

export enum EventNames {
  Create = 'CampaignCreated',
  Donate = 'Donate',
  Withdraw = 'Withdraw',
}

const getEventFunction = (event: string, abi: Abi) => {
  return (abi as Abi).find(
    (item) => item.type === 'event' && item.name === event
  ) as AbiEvent
}

const indexContractEvents = async ({
  contractAddress,
  event,
  fromBlock = BigInt(0),
  toBlock = 'latest',
}: {
  contractAddress: string
  event: EventNames
  fromBlock?: bigint
  toBlock?: bigint | 'latest'
}): Promise<GetLogsReturnType | undefined> => {
  const client = getPublicClient(wagmiProviderConfig)
  if (!client) throw new Error('Error retrieving public client')

  const logs = await client.getLogs({
    address: contractAddress as `0x${string}`,
    event: getEventFunction(event, CampaignAbi as Abi),
    fromBlock,
    toBlock,
  })

  return logs
}

const readContract = async (
  contractAddress: string,
  functionName: string,
  args: (string | number | bigint)[]
) => {
  if (!functionName) throw new Error('Invalid event type')

  const client = getPublicClient(wagmiProviderConfig)
  if (!client) throw new Error('Error retrieving public client')

  const data = await client.readContract({
    address: contractAddress as `0x${string}`,
    abi: CampaignAbi as Abi,
    args,
    functionName: functionName,
  })

  return data
}

export { indexContractEvents, readContract }

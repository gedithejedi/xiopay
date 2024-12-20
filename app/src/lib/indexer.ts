import { wagmiProviderConfig } from '@/lib/chains'
import { parseAbiItem } from 'viem'
import { getPublicClient } from 'wagmi/actions'

export enum EventTypes {
  Create = 'CampaignCreated',
  Updade = 'CampaignUpdated',
  Delete = 'CampaignDeleted',
}

const getEventFunction = (event: EventTypes) => {
  switch (event) {
    case EventTypes.Create:
      return 'event CampaignCreated(bytes32 indexed campaignId, address indexed creator, string name)'
    case EventTypes.Updade:
      return 'event CampaignUpdated(bytes32 indexed campaignId, address indexed updater, string name)'
    case EventTypes.Delete:
      return 'event CampaignDeleted(bytes32 indexed campaignId, address indexed deleter)'
    default:
      return ''
  }
}

const indexContractEvents = async (
  contractAddress: string,
  event: EventTypes = EventTypes.Create
) => {
  const client = getPublicClient(wagmiProviderConfig)
  if (!client) throw new Error('Error retrieving public client')

  const blockNumber = await client.getBlockNumber()
  const functionName = getEventFunction(event)

  if (!functionName) throw new Error('Invalid event type')

  const logs = await client.getLogs({
    address: contractAddress as `0x${string}`,
    event: parseAbiItem(functionName),
    fromBlock: BigInt(0),
    toBlock: BigInt(blockNumber),
  })

  return logs
}

export { indexContractEvents }

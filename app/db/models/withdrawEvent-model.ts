import dayjs from 'dayjs'
import mongoose from 'mongoose'

export interface WithdrawEventInterface {
  campaignId: string
  contractAddress: string
  chainId: string
  byAddress: string
  recipientAddress: string
  amount: bigint
  blockNumber: number
  timestamp: number
  updatedAt?: number
}

export interface IWithdrawEventModel extends WithdrawEventInterface, Document {}

const WithdrawEventSchema = new mongoose.Schema<WithdrawEventInterface>({
  campaignId: { type: String, required: true },
  byAddress: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  contractAddress: { type: String, required: true },
  chainId: { type: String, required: true },
  amount: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  updatedAt: { type: Number, required: true, default: dayjs().unix() },
})

export default mongoose.models.WithdrawEvent ||
  mongoose.model<WithdrawEventInterface>('WithdrawEvent', WithdrawEventSchema)

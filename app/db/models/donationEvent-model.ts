import dayjs from 'dayjs'
import mongoose from 'mongoose'

export interface DonationEventInterface {
  campaignId: string
  fromAddress: string
  contractAddress: string
  chainId: string
  amount: bigint
  name: string
  description: string
  blockNumber: number
  updatedAt?: number
}

export interface IDonationEventModel extends DonationEventInterface, Document {}

const DonationEventSchema = new mongoose.Schema<DonationEventInterface>({
  campaignId: { type: String, required: true },
  fromAddress: { type: String, required: true },
  contractAddress: { type: String, required: true },
  chainId: { type: String, required: true },
  amount: { type: String, required: true },
  name: { type: String, required: false },
  description: { type: String, required: false },
  blockNumber: { type: Number, required: true },
  updatedAt: { type: Number, required: true, default: dayjs().unix() },
})

export default mongoose.models.DonationEvent ||
  mongoose.model<DonationEventInterface>('DonationEvent', DonationEventSchema)

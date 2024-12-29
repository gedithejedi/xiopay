import dayjs from 'dayjs'
import mongoose from 'mongoose'

export interface CampaignInterface {
  campaignId: string
  creator: string
  contractAddress: string
  chainId: number
  name: string
  balance: bigint
  latestBlockUpdate: number
  updatedAt?: number
}

export interface ICampaignModel extends CampaignInterface, Document {}

const CampaignSchema = new mongoose.Schema<CampaignInterface>({
  campaignId: { type: String, required: true, unique: true },
  creator: { type: String, required: true, unique: false },
  contractAddress: { type: String, required: true, unique: false },
  chainId: { type: Number, required: true, unique: false },
  name: { type: String, required: true, unique: false },
  latestBlockUpdate: { type: Number, required: true, unique: false },
  balance: { type: String, required: true, unique: false },
  updatedAt: { type: Number, required: true, default: dayjs().unix() },
})

export default mongoose.models.Campaign ||
  mongoose.model<CampaignInterface>('Campaign', CampaignSchema)

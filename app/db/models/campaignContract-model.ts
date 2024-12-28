import dayjs from 'dayjs'
import mongoose from 'mongoose'

export interface CampaignContractInterface extends mongoose.Document {
  contractAddress: string
  chainId: string
  latestBlockUpdate: number
  updatedAt?: number
}

export interface IUserModel extends CampaignContractInterface, Document {}

const CampaignContractSchema = new mongoose.Schema<CampaignContractInterface>({
  contractAddress: { type: String, required: true, unique: false },
  chainId: { type: String, required: true, unique: false },
  latestBlockUpdate: { type: Number, required: true, unique: false },
  updatedAt: { type: Number, required: true, default: dayjs().unix() },
})

export default mongoose.models.Campaign ||
  mongoose.model<CampaignContractInterface>(
    'CampaignContract',
    CampaignContractSchema
  )

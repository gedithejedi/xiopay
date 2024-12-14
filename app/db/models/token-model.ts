import { Chain } from '@/app/lib/chains'
import mongoose from 'mongoose'

export interface TokenInterface extends mongoose.Document {
  usdPrice?: string
  chainId: Chain
  address: string
  name?: string
  symbol?: string
  decimals?: string
  logo?: string
  updatedAt?: number
}

const TokenSchema = new mongoose.Schema<TokenInterface>({
  address: { type: String, required: true },
  chainId: { type: Number, required: true },
  symbol: { type: String, required: true },
  usdPrice: { type: String, required: false },
  name: { type: String, required: false },
  logo: { type: String, required: false },
  decimals: { type: Number, required: false },
  updatedAt: { type: Number, required: false },
})

export default mongoose.models.Token ||
  mongoose.model<TokenInterface>('Token', TokenSchema)

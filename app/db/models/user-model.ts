import dayjs from 'dayjs'
import mongoose from 'mongoose'

export interface UserInterface extends mongoose.Document {
  dynamicUserId: string
  publicId: string
  // pageLink?: string
  // avatar: string
  updatedAt?: number
}

export interface IUserModel extends UserInterface, Document {}

const UserSchema = new mongoose.Schema<UserInterface>({
  dynamicUserId: { type: String, required: true },
  publicId: { type: String, required: true, unique: true },
  // pageLink: { type: String, required: false, unique: true },
  // avatar: { type: String, required: false },
  updatedAt: { type: Number, required: true, default: dayjs().unix() },
})

export default mongoose.models.User ||
  mongoose.model<UserInterface>('User', UserSchema)

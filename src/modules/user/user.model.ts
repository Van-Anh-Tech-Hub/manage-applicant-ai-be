import { Schema, model, Document } from 'mongoose'
import { I_User, E_Role } from './user.types'
import { passwordHasher } from '../../shared/utils'

export interface IUserDocument extends I_User, Document {
  isModified: (path: string) => boolean
}

const UserSchema = new Schema<IUserDocument>({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(E_Role),
    default: E_Role.CANDIDATE,
  },
  candidateId: { type: Schema.Types.ObjectId, ref: 'CandidateProfile'},
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  isDel: { type: Boolean, default: false },
})

UserSchema.pre('save', async function (next) {
  const user = this as IUserDocument
  if (user.isModified('password')) {
    user.password = passwordHasher.hashPassword(user.password)
  }
  next()
})

export const UserModel = model<IUserDocument>('User', UserSchema)

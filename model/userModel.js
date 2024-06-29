import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: {
    sent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    received: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
    },
  ],
})

userSchema.index({ username: 'text' })

userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()
  delete userObj.password
  return userObj
}

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 12)
})

export default mongoose.model('User', userSchema)

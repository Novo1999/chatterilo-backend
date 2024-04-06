import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
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
})

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

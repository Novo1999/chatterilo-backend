import { Schema, model } from 'mongoose'

export const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    reaction: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export default model('Message', messageSchema)

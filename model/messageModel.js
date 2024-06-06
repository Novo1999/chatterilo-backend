import { Schema, model } from 'mongoose'

export const messageSchema = new Schema({
  messageId: {
    type: Schema.Types.ObjectId,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  reaction: {
    type: String,
    default: '',
  },
})

export default model('Message', messageSchema)

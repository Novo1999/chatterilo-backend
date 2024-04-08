import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
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
})

export default model('Message', messageSchema)
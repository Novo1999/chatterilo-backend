import { Schema, model } from 'mongoose'
import messageSchema from './messageModel.js'

const conversationSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
  },
  messages: {
    type: [messageSchema],
  },
  currentUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  recipientUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default model('Conversation', conversationSchema)

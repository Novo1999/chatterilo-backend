import { Schema, model } from 'mongoose'

const conversationSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
    },
  ],
  lastMessage: { type: String, default: '', required: true },
  lastMessageTimeStamp: { type: Date, default: Date.now },

  participant1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  participant2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

export default model('Conversation', conversationSchema)

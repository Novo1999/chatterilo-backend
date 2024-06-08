import { Schema, model } from 'mongoose'

const conversationSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],

  currentUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  recipientUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default model('Conversation', conversationSchema)

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

  currentUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  recipientUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: {
    type: [String],
    required: true,
  },
})

export default model('Conversation', conversationSchema)

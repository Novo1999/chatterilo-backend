import { Schema, model } from 'mongoose'
import messageSchema from './messageModel.js'

const conversationSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
  },
  messages: {
    type: [messageSchema],
  },
})

export default model('User', conversationSchema)

import { NotFoundError } from '../errors/customErrors.js'
import Conversation from '../model/conversationModel.js'
import Message from '../model/messageModel.js'

export const sendMessage = async (message, senderId) => {
  const { _id } = await Message.create({
    sender: senderId,
    content: message,
  })

  // find conversation using sender id and push the id to the messages array
  const matchedConversation = await Conversation.findOneAndUpdate(
    {
      currentUserId: senderId,
    },
    { $push: { messages: _id } },
    { new: true }
  )

  if (!matchedConversation) {
    throw new NotFoundError('No conversation found with that id')
  }

  return { status: 'success' }
}

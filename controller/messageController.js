import { NotFoundError } from '../errors/customErrors.js'
import Conversation from '../model/conversationModel.js'
import Message from '../model/messageModel.js'

export const sendMessage = async (req) => {
  const { sender, message } = req.body

  const { _id } = await Message.create({
    sender,
    message,
  })

  // find conversation using sender id and push the id to the messages array
  let matchedConversation

  for (let i = 1; i <= 2; i++) {
    matchedConversation = await Conversation.findOneAndUpdate(
      {
        [`participant${i}`]: sender,
      },
      { $push: { messages: _id } },
      { new: true }
    )
    if (matchedConversation) {
      console.log("🚀 ~ sendMessage ~ matchedConversation:", matchedConversation)
      break
    }
  }


  if (!matchedConversation) {
    throw new NotFoundError('No conversation found with that id')
  }

  console.log("SUCCESS")
  return { status: 'success', conversationId: matchedConversation._id }
}

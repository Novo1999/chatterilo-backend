import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js'
import Conversation from '../model/conversationModel.js'
import User from '../model/userModel.js'
import checkValidMongoUtil from '../utils/validMongoUtil.js'

export const createConversation = async (req, res) => {
  const { id: recipientId } = req.params
  const userId = req.user._id

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  checkValidMongoUtil(res, recipientId)

  const userById = await User.findById(userId)

  const hasRecipient = userById.conversations.findIndex(
    (id) => id.toString() === recipientId
  )

  if (hasRecipient !== -1) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: 'Conversation Already exists' })
  } else {
    const conversation = await Conversation.create({
      messages: [],
      currentUserId: userId,
      recipientUserId: recipientId,
    })

    return res.status(StatusCodes.OK).json(conversation)
  }
}

export const getConversation = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id
  console.log('🚀 ~ getConversation ~ userId:', userId)

  checkValidMongoUtil(res, id)

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  // get the conversation
  const conversation = await Conversation.findById(id)

  const user = await User.findById(userId)

  if (!user.conversations.includes(conversation.recipientUserId)) {
    throw new BadRequestError('Not the users conversation')
  }

  if (!conversation) {
    throw new NotFoundError('Conversation not found')
  }

  res.status(StatusCodes.OK).json(conversation)
}

export const getConversations = async (req, res) => {
  const userId = req.user._id
  console.log('🚀 ~ getConversations ~ userId:', userId)

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  const conversations = await Conversation.find({
    currentUserId: userId,
  })

  res.status(StatusCodes.OK).json(conversations)
}

export const saveMessageToConversation = async (req, res) => {
  const { conversationId, messageObj } = req.body
}

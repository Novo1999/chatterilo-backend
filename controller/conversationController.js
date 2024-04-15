import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js'
import Conversation from '../model/conversationModel.js'
import User from '../model/userModel.js'

export const createConversation = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  if (!Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid user ID' })
  }

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  const conversation = await Conversation.create({
    messages: [],
    currentUserId: userId,
    recipientUserId: id,
  })

  res.status(StatusCodes.OK).json(conversation)
}

export const getConversation = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  if (!Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid user ID' })
  }

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  const user = await User.findById(userId)

  if (!user.conversations.includes(id)) {
    throw new BadRequestError('Not the users conversation')
  }

  // get the conversation
  const conversation = await Conversation.findById(id)

  if (!conversation) {
    throw new NotFoundError('Conversation not found')
  }

  res.status(StatusCodes.OK).json(conversation)
}

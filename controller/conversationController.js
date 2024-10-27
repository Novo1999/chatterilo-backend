import { StatusCodes } from 'http-status-codes'
import { NotFoundError, UnauthenticatedError } from '../errors/customErrors.js'
import Conversation from '../model/conversationModel.js'
import Message from '../model/messageModel.js'
import User from '../model/userModel.js'
import checkValidMongoIdUtil from '../utils/validMongoUtil.js'

const checkIfConversationIdExistsInCurrentUser = async (
  userId,
  existingConversationId
) => {
  const user = await User.findById(userId)
  const indexOfConversation = user.conversations.findIndex(
    (conversationId) =>
      conversationId.toString() === existingConversationId.toString()
  )
  if (indexOfConversation !== -1) {
    return true
  } else {
    return false
  }
}

export const createConversation = async (req, res) => {
  const { id: receiverId } = req.params

  const senderId = req.user._id

  if (!senderId) {
    throw new UnauthenticatedError('User not authenticated')
  }
  checkValidMongoIdUtil(res, receiverId)

  // check if there is a conversation with this receiverId

  const existingConversation = await Conversation.findOne({
    $or: [
      {
        participant1: receiverId,
      },
      {
        participant2: receiverId,
      },
    ],
  })
  const conversationId = existingConversation?._id

  if (existingConversation) {
    const isConversationInCurrentUser =
      await checkIfConversationIdExistsInCurrentUser(senderId, conversationId)
    if (isConversationInCurrentUser) {
      throw new Error('This conversation already exists for the user')
    } else {
      await User.findByIdAndUpdate(senderId, {
        $push: {
          conversations: conversationId,
        },
      })
      return res.status(StatusCodes.OK).json(existingConversation)
    }
  } else {
    const conversation = await Conversation.create({
      messages: [],
      participant1: senderId,
      participant2: receiverId,
    })
    // use the existing conversation
    await User.findByIdAndUpdate(senderId, {
      $push: {
        conversations: conversation._id,
      },
    })

    return res.status(StatusCodes.OK).json(conversation)
  }
}
// for getting a single conversation
export const getConversation = async (req, res) => {
  const { id } = req.params
  console.log('🚀 ~ getConversation ~ id:', id)
  const userId = req.user._id
  console.log('🚀 ~ getConversation ~ userId:', userId)

  checkValidMongoIdUtil(res, id)

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  // get the conversation
  const conversation = await Conversation.findById(id)
    .populate({
      path: 'messages',
      model: Message,
    })
    .populate({
      path: 'participant1',
      model: User,
    })
    .populate({
      path: 'participant2',
      model: User,
    })

  if (!conversation) {
    throw new NotFoundError('Conversation not found')
  }

  res.status(StatusCodes.OK).json(conversation)
}

export const getConversations = async (req, res) => {
  const userId = req.user._id

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  const conversations = await Conversation.find({
    $or: [
      {
        participant1: userId,
      },
      {
        participant2: userId,
      },
    ],
  })
    .populate({
      path: 'participant1',
      model: User,
      select: ['username', '_id', 'image'], // only populate these fields for return
    })
    .populate({
      path: 'participant2',
      model: User,
      select: ['username', '_id', 'image'], // only populate these fields for return
    })
    .lean()

  res.status(StatusCodes.OK).json(conversations)
}

export const getConversationLength = async (req, res) => {
  const userId = req.user._id

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }

  const conversationLength = await Conversation.find({
    $or: [
      {
        participant1: userId,
      },
      {
        participant2: userId,
      },
    ],
  }).countDocuments()
  console.log(
    '🚀 ~ getConversationLength ~ conversationLength:',
    conversationLength
  )

  res.status(StatusCodes.OK).json({ conversationLength })
}

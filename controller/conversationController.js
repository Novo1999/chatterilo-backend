import { StatusCodes } from 'http-status-codes'
import { NotFoundError, UnauthenticatedError } from '../errors/customErrors.js'
import Conversation from '../model/conversationModel.js'
import Message from '../model/messageModel.js'
import User from '../model/userModel.js'
import checkValidMongoIdUtil from '../utils/validMongoUtil.js'

export const createConversation = async (req, res) => {
  const { id: recipientId } = req.params

  const userId = req.user._id

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated')
  }
  checkValidMongoIdUtil(res, recipientId)

  // check if there is a conv with this recipientUser or currentUser

  const existingConversation = await Conversation.findOne({
    $or: [
      {
        currentUser: recipientId,
      },
      {
        recipientUser: recipientId,
      },
    ],
  })

  if (existingConversation) {
    const userById = await User.findById(userId)

    const isConversationIdInUsersConversations =
      userById.conversations.findIndex(
        (conv) => conv._id === existingConversation._id
      ) !== -1

    if (isConversationIdInUsersConversations) {
      throw new Error('This conversation already exists for the user')
    }

    // use the existing conversation
    await User.findByIdAndUpdate(userId, {
      $push: {
        conversations: existingConversation._id,
      },
    })
    await Conversation.findOneAndUpdate(
      {
        $or: [
          { currentUser: userId },
          {
            recipientUser: userId,
          },
        ],
      },
      {
        $push: { participants: userId, recipientUser: userId },
      }
    )
    return res.status(StatusCodes.OK).json(existingConversation)
  } else {
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
        currentUser: userId,
        recipientUser: recipientId,
        participants: [userId],
      })

      return res.status(StatusCodes.OK).json(conversation)
    }
  }
}

// for getting a single conversation
export const getConversation = async (req, res) => {
  const { id } = req.params
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
      path: 'recipientUser',
      model: User,
    })
  console.log('🚀 ~ getConversation ~ conversation:', conversation)

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
        currentUser: userId,
      },
      {
        recipientUser: userId,
      },
    ],
  })
    .populate({
      path: 'recipientUser',
      model: User,
    })
    .populate({
      path: 'currentUser',
      model: User,
    })

  const userParticipatedConversations = conversations.filter((conv) =>
    conv.participants.includes(userId)
  )

  res.status(StatusCodes.OK).json(userParticipatedConversations)
}

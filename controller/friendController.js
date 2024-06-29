import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'
import Conversation from '../model/conversationModel.js'
import User from '../model/userModel.js'
import checkValidMongoIdUtil from '../utils/validMongoUtil.js'

export const sendFriendRequest = async (req, res) => {
  const userId = req.user._id
  const receiverId = req.params.id

  // Check if the user is trying to send a friend request to themselves
  if (userId.toString() === receiverId) {
    return res
      .status(400)
      .json({ error: 'Cannot send friend request to yourself' })
  }

  // Check if the recipient user exists
  const recipient = await User.findById(receiverId)
  if (!recipient) {
    return res.status(404).json({ error: 'Recipient user not found' })
  }

  console.log(req.user)

  // Check if the recipient is already a friend or if a friend request has been sent before
  if (
    req.user.friends.includes(recipient._id) ||
    req.user.friendRequests.sent.includes(recipient._id)
  ) {
    return res.status(400).json({
      error: 'Friend request already sent or recipient is already a friend',
    })
  }

  // Update sender's document to add the friend request
  await User.findByIdAndUpdate(userId, {
    $push: { 'friendRequests.sent': recipient._id }, // Update the sent array
  })

  await User.findByIdAndUpdate(receiverId, {
    $push: { 'friendRequests.received': userId }, // Update the received array
  })

  // Respond with success message
  res.status(StatusCodes.OK).json({
    message: `Friend request sent successfully to ${recipient.username}`,
    userId,
  })
}

export const cancelFriendRequest = async (req, res) => {
  const userId = req.user._id
  const receiverId = req.params.id

  // Check if the user is trying to cancel a friend request to themselves
  if (userId.toString() === receiverId) {
    throw new BadRequestError('Cannot cancel friend request to yourself')
  }

  // Check if the recipient user exists
  const recipient = await User.findById(receiverId)
  if (!recipient) {
    return res.status(404).json({ error: 'Recipient user not found' })
  }

  // Check if the friend request exists
  if (!req.user.friendRequests.sent.includes(recipient._id)) {
    return res.status(400).json({
      error: 'Friend request to cancel not found',
    })
  }

  // Update sender's document to remove the friend request
  await User.findByIdAndUpdate(userId, {
    $pull: { 'friendRequests.sent': recipient._id }, // Remove from sent array
  })

  await User.findByIdAndUpdate(receiverId, {
    $pull: { 'friendRequests.received': userId }, // Remove from received array
  })

  // Respond with success message
  res.status(StatusCodes.OK).json({
    message: `Friend request to ${recipient.username} cancelled successfully`,
    userId,
  })
}

export const declineFriendRequest = async (req, res) => {
  const { id } = req.params
  console.log('🚀 ~ declineFriendRequest ~ id:', id)
  const userId = req.user._id
  console.log('🚀 ~ declineFriendRequest ~ userId:', userId)

  checkValidMongoIdUtil(res, id)

  const user = await User.findOne({ _id: userId })

  if (!user) {
    throw new NotFoundError('No user found')
  }

  // remove the friend id from the current logged in users received array of friend requests
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { 'friendRequests.received': id } },
    { new: true }
  )

  // remove the friend id from the senders sent array of friend requests
  const updatedSender = await User.findOneAndUpdate(
    { _id: id },
    { $pull: { 'friendRequests.sent': userId } },
    { new: true }
  )

  res.status(StatusCodes.OK).json({ updatedUser, updatedSender })
}

export const acceptFriendRequest = async (req, res) => {
  const { id } = req.params
  console.log('🚀 ~ acceptFriendRequest ~ id:', id)
  const userId = req.user._id
  console.log('🚀 ~ acceptFriendRequest ~ userId:', userId)

  checkValidMongoIdUtil(res, id)

  const user = await User.findOne({ _id: userId })

  if (!user) {
    throw new NotFoundError('No user found')
  }

  // remove the friend id from the current logged in users received array of friend requests
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { 'friendRequests.received': id },
      $push: {
        friends: { _id: id },
      },
    },
    { new: true }
  )

  // remove the friend id from the senders sent array of friend requests
  const updatedSender = await User.findOneAndUpdate(
    { _id: id },
    {
      $pull: { 'friendRequests.sent': userId },
      $push: {
        friends: { _id: userId },
      },
    },
    { new: true }
  )

  res.status(StatusCodes.OK).json({ updatedUser, updatedSender })
}

export const unfriend = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  // Check if id is a valid ObjectId
  checkValidMongoIdUtil(res, id)

  const user = await User.findOne({ _id: userId })

  if (!user) {
    throw new NotFoundError('No user found')
  }

  // remove the friend id from the current logged in users received array of friend requests
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: {
        friends: id,
        conversations: id,
      },
    },
    { new: true }
  )
  // delete the conversation
  await Conversation.findOneAndDelete({ currentUser: userId })

  // remove the friend id from the senders sent array of friend requests
  const updatedSender = await User.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        friends: userId,
      },
    },
    { new: true }
  )

  res.status(StatusCodes.OK).json({ updatedUser, updatedSender })
}

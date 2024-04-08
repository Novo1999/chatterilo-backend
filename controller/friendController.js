import User from '../model/userModel.js'

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
    $push: { 'friendRequests.received': recipient._id }, // Update the received array
  })

  // Respond with success message
  res.json({
    message: `Friend request sent successfully to ${recipient.username}`,
  })
}

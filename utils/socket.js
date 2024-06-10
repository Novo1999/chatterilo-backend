import moment from 'moment'
import { sendMessage } from '../controller/messageController.js'
import { emitInvalidateUser } from './invalideUserUtil.js'

export const doSocketOperations = (socket, connectedUsers, io) => {
  // connect users upon connection
  socket.on('connected-user', (data) => {
    const existingUserIndex = connectedUsers.findIndex(
      (user) => user.id === data.id
    )
    if (existingUserIndex !== -1) {
      connectedUsers.splice(existingUserIndex, 1)
      if (data) {
        connectedUsers.push({ ...data, socketId: socket.id })
      }
    } else {
      if (data) {
        connectedUsers.push({ ...data, socketId: socket.id })
      }
    }
    // remove those that has no name
    connectedUsers = connectedUsers.filter((user) => user.name)

    io.emit('users', connectedUsers)
    console.log(connectedUsers)
  })

  // when user disconnects
  socket.on('connected-user-dc', (data) => {
    console.log('user-dc', data)
    const existingUserIndex = connectedUsers.findIndex(
      (user) => user.id === data.id
    )
    if (existingUserIndex !== -1) {
      connectedUsers.splice(existingUserIndex, 1)
    } else {
      return
    }
    io.emit('users', connectedUsers)
    console.log('USERS', connectedUsers)
  })

  // send message function
  socket.on('message', async ({ matchedConnectedUser, senderId, message }) => {
    const currentDate = moment().format('YYYY-MM-DD hh:mm A')

    if (matchedConnectedUser) {
      console.log('🚀 ~ socket.on ~ matchedUser:', matchedConnectedUser)
      io.to(matchedConnectedUser.socketId).emit('new_message', {
        sender: senderId,
        content: message,
        timestamp: currentDate,
      })
    }
    // this will save the message in db
    const response = await sendMessage(message, senderId)
    console.log('🚀 ~ socket.on ~ status:', response.status)
  })

  // send user typing socket event
  socket.on('user_typing', ({ matchedConnectedUser, senderId }) => {
    console.log('🚀 ~ socket.on ~ senderId:', senderId)
    console.log('🚀 ~ socket.on ~ matchedConnectedUser:', matchedConnectedUser)
    if (matchedConnectedUser) {
      io.to(matchedConnectedUser.socketId).emit('typing', {
        senderId,
      })
    }
  })

  // send user not typing socket event
  socket.on('user_not_typing', ({ matchedConnectedUser, senderId }) => {
    if (matchedConnectedUser) {
      io.to(matchedConnectedUser.socketId).emit('not_typing', {
        senderId,
      })
    }
  })

  // invalidates the other user after some action
  emitInvalidateUser(socket, io)

  // friend requests
  socket.on(
    'friend-request',
    ({ matchedConnectedUser, from = '', requestMethod }) => {
      if (!matchedConnectedUser) {
        return
      } else {
        io.to(matchedConnectedUser.socketId).emit('friend_request', {
          from: requestMethod === 'SEND' ? from : null,
          requestMethod,
        })
      }
    }
  )
}

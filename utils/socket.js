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

  socket.on('message', (_) => {
    // io.emit('rec_message', 5)
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

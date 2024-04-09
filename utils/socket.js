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

    io.emit('users', connectedUsers)
    console.log(connectedUsers)
  })

  socket.on('connected-user-dc', (data) => {
    const existingUserIndex = connectedUsers.findIndex(
      (user) => user.id === data.id
    )
    if (existingUserIndex !== -1) {
      connectedUsers.splice(existingUserIndex, 1)
    } else {
      return
    }
    io.emit('users', connectedUsers)
  })

  socket.on('message', (_) => {
    io.emit('rec_message', 5)
  })

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

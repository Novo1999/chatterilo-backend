export const emitInvalidateUser = (socket, io) =>
  socket.on('invalidate-user', ({ socketId }) => {
    if (!socketId) return
    io.to(socketId).emit('invalidate')
  })

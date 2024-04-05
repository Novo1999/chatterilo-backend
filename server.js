import express from 'express'
import { createServer } from 'http'
import mongoose from 'mongoose'
import { Server } from 'socket.io'

const app = express()

const PORT = 8080

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

io.on('connect', (socket) => {
  console.log('Connected')
  socket.on('message', (data) => {
    socket.emit('message', data)
  })
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

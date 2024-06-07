import cookieParser from 'cookie-parser'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import express from 'express'
import 'express-async-errors'
import { createServer } from 'http'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { Server } from 'socket.io'
import errorHandlerMiddleware from './middleware/errorHandlerMiddlware.js'
import authRouter from './router/authRoute.js'
import conversationRouter from './router/conversationRouter.js'
import fileRouter from './router/fileRouter.js'
import friendRouter from './router/friendRoute.js'
import userRouter from './router/userRouter.js'
import { doSocketOperations } from './utils/socket.js'

configDotenv()

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(morgan('tiny'))

app.use(cookieParser())

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/conversation', conversationRouter)
app.use('/api', friendRouter)
app.use('/api', fileRouter)
app.use(errorHandlerMiddleware)

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

const PORT = 8080

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST'],
  },
})

let connectedUsers = []
console.log(connectedUsers)
io.on('connect', (socket) => {
  console.log(`User ${socket.id} connected`)

  doSocketOperations(socket, connectedUsers, io)
})

try {
  await mongoose.connect(process.env.MONGO_URL)

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
} catch (error) {
  console.log(error)
}

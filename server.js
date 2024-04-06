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

configDotenv()

const app = express()

app.use(cors())

app.use(morgan('tiny'))

app.use(cookieParser())

app.use(express.json())

app.use('/api', authRouter)
app.use('/api', errorHandlerMiddleware)

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

try {
  await mongoose.connect(process.env.MONGO_URL)

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
} catch (error) {
  console.log(error)
}

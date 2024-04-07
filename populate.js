import dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import mongoose from 'mongoose'
dotenv.config()

import User from './model/userModel.js'

try {
  await mongoose.connect(process.env.MONGO_URL)
  const jsonUsers = JSON.parse(
    await readFile(new URL('./mockData.json', import.meta.url))
  )
  const users = jsonUsers.map((user) => {
    return user
  })
  await User.deleteMany({})
  await User.create(users)
  console.log('Success')
  process.exit(0)
} catch (error) {
  console.log(error)
  process.exit(1)
}

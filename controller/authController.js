import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import User from '../model/userModel.js'
import createSecretToken from '../utils/tokenUtils.js'

export const signUp = async (req, res, next) => {
  const { email, password, username, createdAt } = req.body
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.json({ msg: 'User already exists' })
  }

  const user = await User.create({ email, password, username, createdAt })

  const token = await createSecretToken(user._id)

  res.cookie('token', token, {
    withCredentials: true,
    httpOnly: false,
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'User signed in successfully',
    success: true,
    user,
  })
  next()
}

export const login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.json({ msg: 'Please provide credentials' })
  }
  const user = await User.findOne({
    email,
  })

  if (!user) {
    return res.json({ msg: 'No user by that email' })
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res.json({ msg: 'Incorrect password' })
  }
  const token = await createSecretToken(user._id)
  res.cookie('token', token, {
    withCredentials: true,
    httpOnly: false,
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'User logged in successfully',
    success: true,
    user,
  })
  next()
}

import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/customErrors.js'
import User from '../model/userModel.js'
import createSecretToken from '../utils/tokenUtils.js'

const oneDay = 1000 * 60 * 60 * 24

export const signUp = async (req, res, next) => {
  const { email, password, username, createdAt } = req.body
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new BadRequestError('User already Exists')
  }

  const user = await User.create({ email, password, username, createdAt })

  const token = await createSecretToken(user._id)

  res.cookie('token', token, {
    withCredentials: true,
    httpOnly: true,
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'User signed in successfully',
    success: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    user,
  })
  next()
}

export const login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide credentials')
  }
  const user = await User.findOne({
    email,
  })

  if (!user) {
    throw new BadRequestError('No user by that email')
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new BadRequestError('Incorrect password')
  }
  const token = await createSecretToken(user._id)
  res.cookie('token', token, {
    withCredentials: true,
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'User logged in successfully',
    success: true,
    user,
  })
  next()
}

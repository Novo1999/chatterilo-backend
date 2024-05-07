import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/customErrors.js'
import User from '../model/userModel.js'
import createSecretToken, { createRefreshToken } from '../utils/tokenUtils.js'

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000

export const signUp = async (req, res) => {
  const { email, password, username, createdAt } = req.body
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new BadRequestError('User already Exists')
  }

  const user = await User.create({ email, password, username, createdAt })

  const token = await createSecretToken(user._id)

  res.cookie('token', token, {
    httpOnly: true,
  })

  return res.status(StatusCodes.CREATED).json({
    msg: 'User signed in successfully',
    success: true,
    user,
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  // no email, no password, throw error
  if (!email || !password) {
    throw new BadRequestError('Please provide credentials')
  }

  const user = await User.findOne({
    email,
  })

  // no user found
  if (!user) {
    throw new BadRequestError('No user by that email')
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  // wrong password
  if (!isPasswordCorrect) {
    throw new BadRequestError('Incorrect password')
  }

  // create token
  const token = await createSecretToken(user._id)
  const refreshToken = await createRefreshToken(user._id)

  await res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: ONE_MONTH,
  })

  await res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: ONE_MONTH,
  })

  return res.status(StatusCodes.CREATED).json({
    msg: 'User logged in successfully',
    success: true,
    user,
  })
}

export const logout = async (req, res) => {
  await res.cookie('token', 'logout', {
    httpOnly: true,
  })
  await res.clearCookie('refreshToken')
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies['refreshToken']
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.')
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.TOKEN_REFRESH)

    const accessToken = await createSecretToken(decoded.id)

    await res.cookie('token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: ONE_MONTH,
    })
    await res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: ONE_MONTH,
    })

    return res.status(200).json({ accessToken })
  } catch (error) {
    return res.status(400).send('Invalid refresh token.')
  }
}

import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/customErrors.js'
import User from '../model/userModel.js'
import createSecretToken from '../utils/tokenUtils.js'

const oneDay = 1000 * 60 * 60 * 24
const twoDay = oneDay * 2

export const signUp = async (req, res) => {
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

  return res.status(StatusCodes.CREATED).json({
    msg: 'User signed in successfully',
    success: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    user,
  })
}

export const login = async (req, res) => {
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
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    sameSite: 'None',
  })

  return res.status(StatusCodes.CREATED).json({
    msg: 'User logged in successfully',
    success: true,
    user,
  })
}

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

// export const refreshToken = (req, res) => {
//   const refreshToken = req.cookies['refreshToken']
//   if (!refreshToken) {
//     return res.status(401).send('Access Denied. No refresh token provided.')
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.TOKEN)
//     const accessToken = jwt.sign({ user: decoded.user }, process.env.TOKEN, {
//       expiresIn: '1h',
//     })

//     res.cookie('token', accessToken, {
//       httpOnly: true,
//       expires: new Date(Date.now() + oneDay),
//       secure: true,
//       sameSite: 'None',
//     })

//     return res.status(200).json({ accessToken })
//   } catch (error) {
//     return res.status(400).send('Invalid refresh token.')
//   }
// }

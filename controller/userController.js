import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/customErrors.js'
import User from '../model/userModel.js'

export const getUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: id })
  if (!user) {
    throw new BadRequestError('No user found')
  }
  res.json(user)
}

export const searchUser = async (req, res) => {
  const { q } = req.query

  const regex = new RegExp(q, 'i')
  const users = await User.find({
    _id: { $ne: req.user._id },
    username: { $regex: regex },
  })
  if (users.length === 0) {
    return res.json([])
  }

  if (q) {
    return res.json(users)
  }
}

export const getCurrentUser = async (req, res) => {
  console.log('🚀 ~ getCurrentUser ~ user:', req.user)
  const user = await User.findOne({ _id: req.user._id })
  const userWithoutPassword = user.toJSON()
  res.status(StatusCodes.OK).json({ user: userWithoutPassword })
}

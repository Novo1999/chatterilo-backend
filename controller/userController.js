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

export const getCurrentUser = async (req, res) => {
  console.log(req)
  const user = await User.findOne({ _id: req.user._id })
  const userWithoutPassword = user.toJSON()
  res.status(StatusCodes.OK).json({ user: userWithoutPassword })
}

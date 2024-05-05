import { configDotenv } from 'dotenv'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'
configDotenv()

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.token
  console.log('🌵 ~ verifyUser ~ token:', token)

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' })
  }

  jwt.verify(token, process.env.TOKEN, async (err, data) => {
    console.log('🚀 ~ jwt.verify ~ data:', data)

    if (err) {
      return res.status(401).json({ error: 'Unauthorized' })
    } else {
      try {
        const user = await User.findById(data.id)
        if (user) {
          req.user = user
          next()
        } else {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: 'User not found' })
        }
      } catch (error) {
        console.error('Error retrieving user:', error)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal server error' })
      }
    }
  })
}

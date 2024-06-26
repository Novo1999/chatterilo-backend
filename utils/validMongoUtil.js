import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

const checkValidMongoIdUtil = (res, id) => {
  if (!Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid user ID' })
  }
}
export default checkValidMongoIdUtil

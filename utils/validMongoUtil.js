import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

const checkValidMongoUtil = (res, id) => {
  if (!Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid user ID' })
  }
}
export default checkValidMongoUtil

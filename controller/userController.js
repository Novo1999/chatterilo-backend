import User from '../model/userModel.js'

export const getCurrentUser = async (req, res) => {
  const user = User.findOne({ _id: req.userId })
}

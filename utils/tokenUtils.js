import { configDotenv } from 'dotenv'
import jwt from 'jsonwebtoken'
configDotenv()

const createSecretToken = async (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: 3 * 24 * 60 * 60,
  })
}

// export const createRefreshToken = async (id) => {
//   return jwt.sign({ id }, process.env.TOKEN_REFRESH, {
//     expiresIn: '1d',
//   })
// }

export default createSecretToken

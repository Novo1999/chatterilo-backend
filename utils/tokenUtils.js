import { configDotenv } from 'dotenv'
import jwt from 'jsonwebtoken'
configDotenv()

const createSecretToken = async (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: 3 * 24 * 60 * 60,
  })
}

export default createSecretToken

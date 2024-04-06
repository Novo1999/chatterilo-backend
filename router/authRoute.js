import { Router } from 'express'
import { login, signUp } from '../controller/AuthController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.post('/signup', signUp)
router.post('/login', login)

export default router

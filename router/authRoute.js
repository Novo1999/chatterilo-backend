import { Router } from 'express'
import { login, logout, signUp } from '../controller/AuthController.js'
import { getCurrentUser } from '../controller/userController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/', verifyUser)
router.get('/logout', logout)
router.get('/current-user', verifyUser, getCurrentUser)

export default router

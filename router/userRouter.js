import { Router } from 'express'
import { searchUser } from '../controller/userController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.get('/', verifyUser, searchUser)

export default router

import { Router } from 'express'
import { getUser, searchUser } from '../controller/userController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.get('/', verifyUser, searchUser)
router.get('/users/:id', getUser)

export default router

import { Router } from 'express'
import { sendFriendRequest } from '../controller/friendController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.post('/user/:id', verifyUser, sendFriendRequest)

export default router

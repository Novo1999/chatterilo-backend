import { Router } from 'express'
import {
  cancelFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
} from '../controller/friendController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.post('/user/send-friend-request/:id', verifyUser, sendFriendRequest)

router.delete(
  '/user/cancel-friend-request/:id',
  verifyUser,
  cancelFriendRequest
)

router.delete(
  '/friend/decline-friend-request/:id',
  verifyUser,
  declineFriendRequest
)

export default router

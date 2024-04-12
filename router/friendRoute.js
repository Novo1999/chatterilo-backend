import { Router } from 'express'
import {
  acceptFriendRequest,
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

router.patch(
  '/friend/accept-friend-request/:id',
  verifyUser,
  acceptFriendRequest
)

router.patch(
  '/friend/decline-friend-request/:id',
  verifyUser,
  declineFriendRequest
)

export default router

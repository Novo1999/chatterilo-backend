import { Router } from 'express'

import {
  createConversation,
  getConversation,
} from '../controller/conversationController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.get('/:id', verifyUser, getConversation)
router.post('/:id', verifyUser, createConversation)

export default router

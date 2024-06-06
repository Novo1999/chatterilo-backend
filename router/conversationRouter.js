import { Router } from 'express'

import {
  createConversation,
  getConversation,
  getConversations,
} from '../controller/conversationController.js'
import { verifyUser } from '../middleware/authMiddleware.js'
const router = Router()

router.get('/all', verifyUser, getConversations)
router.get('/:id', verifyUser, getConversation)
router.post('/:id', verifyUser, createConversation)
// router.patch('/:id', verifyUser, saveMessageToConversation)

export default router

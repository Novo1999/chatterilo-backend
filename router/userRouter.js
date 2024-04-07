import { Router } from 'express'
import { searchUser } from '../controller/userController.js'
const router = Router()

router.get('/', searchUser)

export default router

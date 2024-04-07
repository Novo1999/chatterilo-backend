import { createRouteHandler } from 'uploadthing/express'

import { Router } from 'express'
import { uploadRouter } from '../utils/uploadthing.js'

const router = Router()

router.use(
  '/uploadthing',
  createRouteHandler({
    router: uploadRouter,
  })
)

export default router

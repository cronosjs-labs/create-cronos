import { Router } from 'express'
import { defaultController } from '../controllers/default.controller.js'

const router = Router()

router.get('/', defaultController)

export default router

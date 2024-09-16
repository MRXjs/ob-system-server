import express from 'express'
import { isLogin, login, logout, test } from '../controllers/admin.controller'
import { isAuthenticated } from '../middleware/auth'

const adminRouter = express.Router()

adminRouter.get('/test', test)
adminRouter.post('/login', login)
adminRouter.get('/is-login', isAuthenticated, isLogin)
adminRouter.get('/logout', logout)

export default adminRouter

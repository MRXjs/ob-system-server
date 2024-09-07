import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    addPaidMember,
    deletePaidMember,
    getAllPaidMember,
} from '../controllers/paidMember.controller'

const paidMemberRoute = express.Router()

paidMemberRoute.get('/paid-members', isAuthenticated, getAllPaidMember)
paidMemberRoute.post('/add-paid-member', isAuthenticated, addPaidMember)
paidMemberRoute.delete('/delete-paid-member', isAuthenticated, deletePaidMember)

export default paidMemberRoute

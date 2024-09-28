import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    addPaidMember,
    deletePaidMember,
    getAllFeeMemberByfId,
    getAllPaidMember,
    paidMemberMark,
} from '../controllers/paidMember.controller'

const paidMemberRoute = express.Router()

paidMemberRoute.get('/fee-member/:fee_id', isAuthenticated, getAllFeeMemberByfId)
paidMemberRoute.get('/paid-members', isAuthenticated, getAllPaidMember)
paidMemberRoute.post('/add-paid-member', isAuthenticated, addPaidMember)
paidMemberRoute.delete('/delete-paid-member', isAuthenticated, deletePaidMember)
paidMemberRoute.put('/paid-member-mark', isAuthenticated, paidMemberMark)

export default paidMemberRoute

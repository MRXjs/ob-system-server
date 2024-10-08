import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    addPaidMember,
    deletePaidMember,
    getAllFeeMemberByfId,
    getAllPaidMember,
    getUnpaidFees,
    paidMemberMark,
    paidPercentage,
} from '../controllers/paidMember.controller'

const paidMemberRoute = express.Router()

paidMemberRoute.get('/fee-member/:fee_id', isAuthenticated, getAllFeeMemberByfId)
paidMemberRoute.get('/paid-members', isAuthenticated, getAllPaidMember)
paidMemberRoute.post('/add-paid-member', isAuthenticated, addPaidMember)
paidMemberRoute.delete('/delete-paid-member', isAuthenticated, deletePaidMember)
paidMemberRoute.put('/paid-member-mark', isAuthenticated, paidMemberMark)
paidMemberRoute.get(
    '/member-membership-paid-percentage/:member_id',
    isAuthenticated,
    paidPercentage,
)
paidMemberRoute.get('/get-unpaid-fees/:member_id', isAuthenticated, getUnpaidFees)

export default paidMemberRoute

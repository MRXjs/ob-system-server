import express from 'express'
import {
    createMembershipFee,
    deleteMembershipFee,
    getMembershipFees,
    updateMembershipFee,
} from '../controllers/membershipFee.controller'
import { isAuthenticated } from '../middleware/auth'

const membershipFeeRoute = express.Router()

membershipFeeRoute.get('/membership-fees', isAuthenticated, getMembershipFees)
membershipFeeRoute.post('/create-membership-fees', isAuthenticated, createMembershipFee)
membershipFeeRoute.put('/update-membership-fees/:fee_id', isAuthenticated, updateMembershipFee)
membershipFeeRoute.delete('/delete-membership-fees/:fee_id', isAuthenticated, deleteMembershipFee)

export default membershipFeeRoute

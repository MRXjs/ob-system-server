import express from 'express'
import {
    addMember,
    deleteMember,
    getAllMember,
    getGenderPercentages,
    getMemberCount,
    updateMember,
} from '../controllers/member.controller'
import { isAuthenticated } from '../middleware/auth'

const memberRouter = express.Router()

memberRouter.get('/members', isAuthenticated, getAllMember)
memberRouter.get('/member-count', isAuthenticated, getMemberCount)
memberRouter.get('/member-gender-percentages', isAuthenticated, getGenderPercentages)
memberRouter.post('/add-member', isAuthenticated, addMember)
memberRouter.put('/update-member/:member_id', isAuthenticated, updateMember)
memberRouter.delete('/delete-member/:member_id', isAuthenticated, deleteMember)

export default memberRouter

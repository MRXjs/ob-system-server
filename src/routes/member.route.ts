import express from 'express'
import {
    addMember,
    avatarDelete,
    avatarUploadResHandler,
    deleteMember,
    getAllMember,
    getGenderPercentages,
    getMemberById,
    getMemberCount,
    sendAvatar,
    updateMember,
} from '../controllers/member.controller'
import { isAuthenticated } from '../middleware/auth'
import { avatarUpload } from '../middleware/avatarUpload'

const memberRouter = express.Router()

memberRouter.get('/members', isAuthenticated, getAllMember)
memberRouter.get('/member/:member_id', isAuthenticated, getMemberById)
memberRouter.get('/member-count', isAuthenticated, getMemberCount)
memberRouter.get('/member-gender-percentages', isAuthenticated, getGenderPercentages)
memberRouter.post('/add-member', isAuthenticated, addMember)
memberRouter.put('/update-member/:member_id', isAuthenticated, updateMember)
memberRouter.delete('/delete-member/:member_id', isAuthenticated, deleteMember)
memberRouter.post(
    '/avatar-upload',
    isAuthenticated,
    avatarUpload.single('avatar'),
    avatarUploadResHandler,
)
memberRouter.delete('/avatar-delete/:filename', isAuthenticated, avatarDelete)
memberRouter.get('/avatar/:filename', sendAvatar)

export default memberRouter

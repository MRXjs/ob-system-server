import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    createMeeting,
    deleteMeeting,
    getAllMeetings,
    getMeetingCount,
    updateMeeting,
} from '../controllers/meeting.controller'

const meetingRouter = express.Router()

meetingRouter.get('/meetings', isAuthenticated, getAllMeetings)
meetingRouter.get('/meeting-count', isAuthenticated, getMeetingCount)
meetingRouter.post('/create-meeting', isAuthenticated, createMeeting)
meetingRouter.put('/update-meeting/:meeting_id', isAuthenticated, updateMeeting)
meetingRouter.delete('/delete-meeting/:meeting_id', isAuthenticated, deleteMeeting)

export default meetingRouter

import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    createMeetingInvolve,
    deleteMeetingInvolve,
    getAllMeetingInvolves,
} from '../controllers/meetingInvolve.controller'

const meetingInvolveRoute = express.Router()

meetingInvolveRoute.get('/meeting-involves', isAuthenticated, getAllMeetingInvolves)
meetingInvolveRoute.post('/create-meeting-involve', isAuthenticated, createMeetingInvolve)
meetingInvolveRoute.delete('/delete-meeting-involve', isAuthenticated, deleteMeetingInvolve)

export default meetingInvolveRoute

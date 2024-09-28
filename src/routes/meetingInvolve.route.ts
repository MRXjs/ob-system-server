import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    attendanceMark,
    attendancePercentage,
    createMeetingInvolve,
    deleteMeetingInvolve,
    getAllMeetingInvolvesBymId,
} from '../controllers/meetingInvolve.controller'

const meetingInvolveRoute = express.Router()

meetingInvolveRoute.get(
    '/meeting-involves/:meeting_id',
    isAuthenticated,
    getAllMeetingInvolvesBymId,
)
meetingInvolveRoute.post('/create-meeting-involve', isAuthenticated, createMeetingInvolve)
meetingInvolveRoute.delete('/delete-meeting-involve', isAuthenticated, deleteMeetingInvolve)
meetingInvolveRoute.put('/meeting-attendance-mark', isAuthenticated, attendanceMark)
meetingInvolveRoute.get(
    '/member-meeting-attendance-percentage/:member_id',
    isAuthenticated,
    attendancePercentage,
)

export default meetingInvolveRoute

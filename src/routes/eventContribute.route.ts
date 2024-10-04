import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    addEventContribute,
    contributePercentage,
    deleteEventContribute,
    eventContributeMark,
    getAllEventContribute,
    getAllEventContributesByEId,
    getNotContributeEvents,
} from '../controllers/eventContribute.controller'

const eventContributeRoute = express.Router()

eventContributeRoute.get(
    '/event_contributes/:event_id',
    isAuthenticated,
    getAllEventContributesByEId,
)
eventContributeRoute.get('/event_contributes', isAuthenticated, getAllEventContribute)
eventContributeRoute.post('/add-event_contribute', isAuthenticated, addEventContribute)
eventContributeRoute.delete('/delete-event_contribute', isAuthenticated, deleteEventContribute)
eventContributeRoute.put('/event-contribute-mark', isAuthenticated, eventContributeMark)
eventContributeRoute.get(
    '/member-event-contribute-percentage/:member_id',
    isAuthenticated,
    contributePercentage,
)
eventContributeRoute.get(
    '/get-not-contribute-events/:member_id',
    isAuthenticated,
    getNotContributeEvents,
)

export default eventContributeRoute

import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    addEventContribute,
    deleteEventContribute,
    eventContributeMark,
    getAllEventContribute,
    getAllEventContributesByEId,
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

export default eventContributeRoute

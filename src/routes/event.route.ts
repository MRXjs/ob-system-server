import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getEventCount,
    getLatestEvents,
    updateEvent,
} from '../controllers/event.controller'

const eventRouter = express.Router()

eventRouter.get('/events', isAuthenticated, getAllEvents)
eventRouter.get('/event-count', isAuthenticated, getEventCount)
eventRouter.get('/latest-events', isAuthenticated, getLatestEvents)
eventRouter.post('/create-event', isAuthenticated, createEvent)
eventRouter.put('/update-event/:event_id', isAuthenticated, updateEvent)
eventRouter.delete('/delete-event/:event_id', isAuthenticated, deleteEvent)

export default eventRouter

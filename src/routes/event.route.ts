import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
    createEvent,
    deleteEvent,
    getAllEvents,
    updateEvent,
} from '../controllers/event.controller'

const eventRouter = express.Router()

eventRouter.get('/events', isAuthenticated, getAllEvents)
eventRouter.post('/create-event', isAuthenticated, createEvent)
eventRouter.put('/update-event/:event_id', isAuthenticated, updateEvent)
eventRouter.delete('/delete-event/:event_id', isAuthenticated, deleteEvent)

export default eventRouter

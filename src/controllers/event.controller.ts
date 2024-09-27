import { NextFunction, query, Response } from 'express'
import { Request } from 'express-serve-static-core'
import { db } from '../utils/db'

// get all events
export const getAllEvents = (req: Request, res: Response, next: NextFunction) => {
    const query = 'SELECT * FROM event'
    db.query(query, (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, eventData: data })
    })
}

// get event count
export const getEventCount = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT COUNT(*) FROM event', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const rowCount = data[0]['COUNT(*)']
        return res.status(200).json({ success: true, rowCount })
    })
}

export const getLatestEvents = (req: Request, res: Response, next: NextFunction) => {
    const query = 'SELECT * FROM event ORDER BY date DESC LIMIT 3'

    db.query(query, (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, eventData: data })
    })
}
// create event
export const createEvent = (req: Request, res: Response, next: NextFunction) => {
    const { date, name, description } = req.body
    const query = `INSERT INTO event (date , name , description) VALUES (?, ?, ?)`

    db.query(query, [date, name, description], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const eventId = result.insertId
        db.query('SELECT member_id FROM member', (err: any, memberResult: any) => {
            if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

            let memberIds: number[] = memberResult.map((member: any) => member.member_id)

            const contributeQuery =
                'INSERT INTO event_contribute (member_id, event_id, status) VALUES ?'

            const involveValues = memberIds.map((memberId: number) => [memberId, eventId, false])

            db.query(contributeQuery, [involveValues], (err: any, involveResult: any) => {
                if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
                return res
                    .status(201)
                    .json({ success: true, message: 'Meeting created successfully' })
            })
        })
    })
}

// update event by id
export const updateEvent = (req: Request, res: Response, next: NextFunction) => {
    const { event_id } = req.params
    const event = req.body

    // Filter out undefined fields
    const fieldsToUpdate = Object.keys(event).filter((key) => event[key] !== undefined)
    const valuesToUpdate = fieldsToUpdate.map((key) => event[key])
    const setClause = fieldsToUpdate.map((key) => `${String(key)} = ?`).join(', ')

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' })
    }

    const query = `UPDATE event SET ${setClause} WHERE event_id = ?`

    db.query(query, [...valuesToUpdate, event_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' })
        }

        return res.status(200).json({ success: true, message: 'Event updated successfully' })
    })
}

export const deleteEvent = (req: Request, res: Response, next: NextFunction) => {
    const { event_id } = req.params

    const query = 'DELETE FROM event WHERE event_id = ?'
    const values = [event_id]

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' })
        }

        return res.status(200).json({ success: true, message: 'Event deleted successfully' })
    })
}

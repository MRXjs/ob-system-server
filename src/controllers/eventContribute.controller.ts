import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'

// get all event contributes
export const getAllEventContribute = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT * FROM event_contribute', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, data })
    })
}

// create event contributes
export const addEventContribute = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, event_id, status } = req.body

    const query = `INSERT INTO event_contribute (member_id, event_id, status) VALUES (?, ?, ?)`

    db.query(query, [member_id, event_id, status], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        return res
            .status(201)
            .json({ success: true, message: 'Event contribute create successfully' })
    })
}

// delete event contributes
export const deleteEventContribute = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, event_id } = req.body

    const query = 'DELETE FROM event_contribute WHERE member_id = ? AND event_id = ?;'
    const values = [member_id, event_id]

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Event contributes not found' })
        }

        return res
            .status(200)
            .json({ success: true, message: 'Event contributes deleted successfully' })
    })
}

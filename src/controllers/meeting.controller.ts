import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'

// get all meetings
export const getAllMeetings = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT * FROM meeting', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, data })
    })
}

// get meeting count
export const getMeetingCount = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT COUNT(*) FROM meeting', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const rowCount = data[0]['COUNT(*)']
        return res.status(200).json({ success: true, rowCount })
    })
}

// create meeting
export const createMeeting = (req: Request, res: Response, next: NextFunction) => {
    const { date, description } = req.body

    const query = `INSERT INTO meeting (date, description) VALUES (?, ?)`

    db.query(query, [date, description], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        return res.status(201).json({ success: true, message: 'Meeting create successfully' })
    })
}

// update meetings
export const updateMeeting = (req: Request, res: Response, next: NextFunction) => {
    const { meeting_id } = req.params
    const meetingData = req.body

    // Filter out undefined fields
    const fieldsToUpdate = Object.keys(meetingData).filter((key) => meetingData[key] !== undefined)
    const valuesToUpdate = fieldsToUpdate.map((key) => meetingData[key])
    const setClause = fieldsToUpdate.map((key) => `${String(key)} = ?`).join(', ')

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' })
    }

    const query = `UPDATE meeting SET ${setClause} WHERE meeting_id = ?`

    db.query(query, [...valuesToUpdate, meeting_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Meeting not found' })
        }

        return res.status(200).json({ success: true, message: 'Meeting updated successfully' })
    })
}

// delete meeting
export const deleteMeeting = (req: Request, res: Response, next: NextFunction) => {
    const { meeting_id } = req.params

    const query = 'DELETE FROM meeting WHERE meeting_id = ?'
    const values = [meeting_id]

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Meeting not found' })
        }

        return res.status(200).json({ success: true, message: 'Meeting deleted successfully' })
    })
}

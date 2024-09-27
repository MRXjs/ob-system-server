import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'

// Get all meeting involves by meeting_id
export const getAllMeetingInvolvesBymId = (req: Request, res: Response, next: NextFunction) => {
    const { meeting_id } = req.params

    const query = `
        SELECT 
            mi.*, 
            m.full_name,m.member_id
        FROM 
            meeting_involve mi
        INNER JOIN 
            member m ON mi.member_id = m.member_id
        WHERE 
            mi.meeting_id = ?
    `

    db.query(query, [meeting_id], (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, meetingInvolves: data })
    })
}

// create meeting involve
export const createMeetingInvolve = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, meeting_id, status } = req.body

    const query = `INSERT INTO meeting_involve (member_id, meeting_id, status) VALUES (?, ?, ?)`

    db.query(query, [member_id, meeting_id, status], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        return res
            .status(201)
            .json({ success: true, message: 'Meeting Involve create successfully' })
    })
}

// delete meeting involve
export const deleteMeetingInvolve = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, meeting_id } = req.body

    const query = 'DELETE FROM meeting_involve WHERE member_id = ? AND meeting_id = ?;'
    const values = [member_id, meeting_id]

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Meeting involve not found' })
        }

        return res
            .status(200)
            .json({ success: true, message: 'Meeting involve deleted successfully' })
    })
}

// Mark attendance by meeting_id and member_id
export const attendanceMark = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, meeting_id, status } = req.body

    const query = `UPDATE meeting_involve SET status = ? WHERE member_id = ? AND meeting_id = ?`

    db.query(query, [status, member_id, meeting_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Record not found' })
        }

        return res.status(200).json({ success: true, message: 'Attendance marked successfully' })
    })
}

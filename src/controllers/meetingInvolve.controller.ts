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

        return res
            .status(200)
            .json({ success: true, message: 'Attendance mark or unmarked  successfully' })
    })
}

// Get member meeting attendance percentage by member_id
export const attendancePercentage = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params

    // Query to get total meetings and present count for the member
    const query = `
        SELECT 
            COUNT(mi.meeting_id) AS totalMeetings,
            SUM(CASE WHEN mi.status = 1 THEN 1 ELSE 0 END) AS presentMeetings
        FROM 
            meeting_involve mi
        WHERE 
            mi.member_id = ?
    `

    db.query(query, [member_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'No attendance data found for this member' })
        }

        const totalMeetings = result[0].totalMeetings || 0
        const presentMeetings = result[0].presentMeetings || 0

        // Calculate attendance percentage
        const attendancePercentage =
            totalMeetings > 0 ? Math.round((presentMeetings / totalMeetings) * 100) : 0

        return res.status(200).json({
            success: true,
            attendancePercentageData: {
                member_id,
                totalMeetings,
                presentMeetings,
                attendancePercentage,
            },
        })
    })
}

// Get all absent meetings by member_id
export const getAbsentMeetings = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params

    const query = `
        SELECT 
            m.meeting_id, 
            m.date, 
            m.description 
        FROM 
            meeting_involve mi
        INNER JOIN 
            meeting m ON mi.meeting_id = m.meeting_id
        WHERE 
            mi.member_id = ? AND mi.status = 0
    `

    db.query(query, [member_id], (err: any, results: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (results.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'No absent meetings found for this member' })
        }

        return res.status(200).json({ success: true, meetingData: results })
    })
}

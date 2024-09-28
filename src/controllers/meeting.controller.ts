import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'

// get all meetings
export const getAllMeetings = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT * FROM meeting', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, meetingData: data })
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

    db.query(query, [date, description], (err: any, meetingResult: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const meetingId = meetingResult.insertId

        db.query('SELECT member_id FROM member', (err: any, memberResult: any) => {
            if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

            let memberIds: number[] = memberResult.map((member: any) => member.member_id)

            const involveQuery =
                'INSERT INTO meeting_involve (member_id, meeting_id, status) VALUES ?'

            const involveValues = memberIds.map((memberId: number) => [memberId, meetingId, false])

            db.query(involveQuery, [involveValues], (err: any, involveResult: any) => {
                if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
                return res
                    .status(201)
                    .json({ success: true, message: 'Meeting created successfully' })
            })
        })
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
    const deleteMeetingQuery = 'DELETE FROM meeting WHERE meeting_id = ?'

    db.query(deleteMeetingQuery, [meeting_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Meeting not found' })
        }

        return res.status(200).json({ success: true, message: 'Meeting deleted successfully' })
    })
}

// Get last five meeting attendance percentage
export const getMeetingAttendancePercentage = (req: Request, res: Response, next: NextFunction) => {
    // Query to get the last five meetings
    const query = `
        SELECT 
            m.meeting_id, 
            m.date, 
            SUM(CASE WHEN mi.status = 1 THEN 1 ELSE 0 END) AS present,
            SUM(CASE WHEN mi.status = 0 THEN 1 ELSE 0 END) AS absent,
            COUNT(mi.member_id) AS total
        FROM 
            meeting m
        INNER JOIN 
            meeting_involve mi ON m.meeting_id = mi.meeting_id
        GROUP BY 
            m.meeting_id
        ORDER BY 
            m.date DESC
        LIMIT 5
    `

    db.query(query, (err: any, results: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        // Calculate percentage for each meeting
        const attendanceData = results.map((meeting: any) => ({
            date: meeting.date,
            present: Math.round((meeting.present / meeting.total) * 100), // Calculate present percentage
            absent: Math.round((meeting.absent / meeting.total) * 100), // Calculate absent percentage
        }))

        return res.status(200).json({ success: true, attendanceData })
    })
}

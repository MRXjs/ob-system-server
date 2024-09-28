import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'

// get all event contributes by event id
export const getAllEventContributesByEId = (req: Request, res: Response, next: NextFunction) => {
    const { event_id } = req.params
    const query = `
        SELECT 
            ec.*, 
            m.full_name,m.member_id
        FROM 
            event_contribute ec
        INNER JOIN 
            member m ON ec.member_id = m.member_id
        WHERE 
            ec.event_id = ?
    `

    db.query(query, [event_id], (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, eventContributes: data })
    })
}

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

// Mark attendance by meeting_id and member_id
export const eventContributeMark = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, event_id, status } = req.body

    const query = `UPDATE event_contribute SET status = ? WHERE member_id = ? AND event_id = ?`

    db.query(query, [status, member_id, event_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Record not found' })
        }

        return res
            .status(200)
            .json({ success: true, message: 'Event contribute marked or unmarked successfully' })
    })
}

// Get member event contribute percentage by member_id
export const contributePercentage = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params

    const query = `
        SELECT 
            COUNT(ec.event_id) AS totalEvents,
            SUM(CASE WHEN ec.status = 1 THEN 1 ELSE 0 END) AS contributeEvents
        FROM 
            event_contribute ec
        WHERE 
            ec.member_id = ?
    `

    db.query(query, [member_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'No contribute data found for this member' })
        }

        const totalEvents = result[0].totalEvents || 0
        const contributeEvents = result[0].contributeEvents || 0

        const contributePercentage =
            totalEvents > 0 ? Math.round((contributeEvents / totalEvents) * 100) : 0

        return res.status(200).json({
            success: true,
            contributePercentageData: {
                member_id,
                totalEvents,
                contributeEvents,
                contributePercentage,
            },
        })
    })
}

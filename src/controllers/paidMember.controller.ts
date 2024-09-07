import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'

// get all paid member
export const getAllPaidMember = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT * FROM paid_member', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        return res.status(200).json({ success: true, data })
    })
}

// add paid member
export const addPaidMember = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, fee_id, status } = req.body

    const query = `INSERT INTO paid_member (member_id, fee_id , status ) VALUES (?, ?, ?)`

    db.query(query, [member_id, fee_id, status], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        return res.status(201).json({ success: true, message: 'Paid member added successfully' })
    })
}

// delete paid member
export const deletePaidMember = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, fee_id } = req.body

    const query = 'DELETE FROM paid_member WHERE member_id = ? AND fee_id = ?;'
    const values = [member_id, fee_id]

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Paid member not found' })
        }

        return res.status(200).json({ success: true, message: 'Paid member deleted successfully' })
    })
}

import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'

export const getAllFeeMemberByfId = (req: Request, res: Response, next: NextFunction) => {
    const { fee_id } = req.params

    const query = `
        SELECT 
            pm.*, 
            m.full_name,m.member_id
        FROM 
            paid_member pm
        INNER JOIN 
            member m ON pm.member_id = m.member_id
        WHERE 
            pm.fee_id = ?
    `

    db.query(query, [fee_id], (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, feeMember: data })
    })
}

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

// paid member mark
export const paidMemberMark = (req: Request, res: Response, next: NextFunction) => {
    const { member_id, fee_id, status } = req.body

    const query = `UPDATE paid_member SET status = ? WHERE member_id = ? AND fee_id = ?`

    db.query(query, [status, member_id, fee_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Record not found' })
        }

        return res
            .status(200)
            .json({ success: true, message: 'Paid Mark or unmarked successfully' })
    })
}

// Get member membership paid percentage by member_id
export const paidPercentage = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params

    const query = `
        SELECT 
            COUNT(pm.fee_id) AS totalFees,
            SUM(CASE WHEN pm.status = 1 THEN 1 ELSE 0 END) AS paidFees
        FROM 
            paid_member pm
        WHERE 
            pm.member_id = ?
    `

    db.query(query, [member_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'No paid data found for this member' })
        }

        const totalFees = result[0].totalFees || 0
        const paidFees = result[0].paidFees || 0

        const paidPercentage = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0

        return res.status(200).json({
            success: true,
            paidPercentageData: {
                member_id,
                totalFees,
                paidFees,
                paidPercentage,
            },
        })
    })
}

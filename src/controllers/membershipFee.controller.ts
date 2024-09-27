import { NextFunction, query, Request, Response } from 'express'
import { db } from '../utils/db'

// get all member fees
export const getMembershipFees = (req: Request, res: Response, next: NextFunction) => {
    const query = 'SELECT * FROM membership_fee'

    db.query(query, (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })
        return res.status(200).json({ success: true, feesData: data })
    })
}

// get membership fee count
export const getMembershipFeeCount = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT COUNT(*) FROM membership_fee', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const rowCount = data[0]['COUNT(*)']
        return res.status(200).json({ success: true, rowCount })
    })
}

// create member fee
export const createMembershipFee = (req: Request, res: Response, next: NextFunction) => {
    const { date, fee, description } = req.body

    const query = 'INSERT INTO membership_fee(date, fee, description) VALUES(?, ?, ?)'

    db.query(query, [date, fee, description], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        return res.status(201).json({ success: true, message: 'Member Fee create successfully' })
    })
}

// update membership fee
export const updateMembershipFee = (req: Request, res: Response, next: NextFunction) => {
    const { fee_id } = req.params
    const membershipFee = req.body

    // Filter out undefined fields
    const fieldsToUpdate = Object.keys(membershipFee).filter(
        (key) => membershipFee[key] !== undefined,
    )
    const valuesToUpdate = fieldsToUpdate.map((key) => membershipFee[key])
    const setClause = fieldsToUpdate.map((key) => `${String(key)} = ?`).join(', ')

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' })
    }

    const query = `UPDATE membership_fee SET ${setClause} WHERE fee_id = ?`

    db.query(query, [...valuesToUpdate, fee_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Membership Fee not found' })
        }

        // prettier-ignore
        return res.status(200).json({ success: true, message: 'Membership Fee updated successfully' })
    })
}

// delete membership fee
export const deleteMembershipFee = (req: Request, res: Response, next: NextFunction) => {
    const { fee_id } = req.params

    const query = 'DELETE FROM membership_fee WHERE fee_id = ?'
    const values = [fee_id]

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Membership Fee not found' })
        }

        // prettier-ignore
        return res.status(200).json({ success: true, message: 'Membership Fee deleted successfully' })
    })
}

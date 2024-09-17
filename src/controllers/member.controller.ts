import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'
import { getMemberValues } from '../utils/fuctions'
import { Member } from '../utils/types'

// get all members
export const getAllMember = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT * FROM member', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const memberData = data.map((member: any) => {
            return {
                memberId: member.member_id,
                fullName: member.full_name,
                yearOfJoingSchool: member.year_of_joing_school,
                yearOfOutSchool: member.year_of_out_school,
                facebookName: member.facebook_name,
                studyPeriod:
                    member.year_of_joing_school && member.year_of_out_school
                        ? `${member.year_of_joing_school}-${member.year_of_out_school}`
                        : '',
                phoneNumber: member.phone_number,
                address: member.address,
                job: member.job,
                jobPosition: member.job_position,
                dob: member.dob,
                gender: member.gender,
                civilStatus: member.civil_status,
                whatsappNumber: member.whatsapp_number,
            }
        })
        return res.status(200).json({ success: true, memberData })
    })
}

// get member count
export const getMemberCount = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT COUNT(*) FROM member', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const rowCount = data[0]['COUNT(*)']
        return res.status(200).json({ success: true, rowCount })
    })
}

// add member
export const addMember = (req: Request, res: Response, next: NextFunction) => {
    const member: Member = req.body

    const query = `
    INSERT INTO member (
        member_id, full_name, year_of_joing_school, year_of_out_school, 
        facebook_name, phone_number, address, job_position, job, 
        dob, gender, civil_status, whatsapp_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    db.query(query, getMemberValues(member), (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        return res.status(201).json({ success: true, message: 'Member added successfully' })
    })
}

// update member by id
export const updateMember = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params
    const member: Member = req.body

    // Filter out undefined fields
    const fieldsToUpdate = (Object.keys(member) as (keyof Member)[]).filter(
        (key) => member[key] !== undefined,
    )
    const valuesToUpdate = fieldsToUpdate.map((key) => member[key])
    const setClause = fieldsToUpdate.map((key) => `${String(key)} = ?`).join(', ')

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' })
    }

    const query = `UPDATE member SET ${setClause} WHERE member_id = ?`

    db.query(query, [...valuesToUpdate, member_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' })
        }

        return res.status(200).json({ success: true, message: 'Member updated successfully' })
    })
}

// delete member
export const deleteMember = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params

    const query = 'DELETE FROM member WHERE member_id = ?'
    const values = [member_id]

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' })
        }

        return res.status(200).json({ success: true, message: 'Member deleted successfully' })
    })
}

// Get member gender percentages
export const getGenderPercentages = (req: Request, res: Response, next: NextFunction) => {
    const query = `SELECT gender, COUNT(*) AS count, (COUNT(*) / (SELECT COUNT(*) FROM member)) * 100 AS percentage FROM member WHERE gender IN ('male', 'female') GROUP BY gender;`

    db.query(query, (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        const genderData: any = {}
        data.forEach((item: any) => {
            genderData[item.gender] = {
                count: item.count,
                percentage: item.percentage,
            }
        })
        return res.status(200).json({ success: true, genderData })
    })
}

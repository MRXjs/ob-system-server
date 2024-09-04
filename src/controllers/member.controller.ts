import { NextFunction, Request, Response } from 'express';
import { db } from '../utils/db';
import { getMemberValues } from '../utils/fuctions';
import { Member } from '../utils/types';

// get all members
export const getAllMember = (req: Request, res: Response, next: NextFunction) => {
    db.query('SELECT * FROM member', (err: any, data: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

        return res.status(200).json({ success: true, data });
    });
};

// add member
export const addMember = (req: Request, res: Response, next: NextFunction) => {
    const member: Member = req.body;

    const query = `
    INSERT INTO member (
        member_id, full_name, year_of_joing_school, year_of_out_school, 
        facebook_name, phone_number, address, job_position, job, 
        dob, gender, civil_status, whatsapp_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, getMemberValues(member), (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

        return res.status(201).json({ success: true, message: 'Member added successfully' });
    });
};

// update member by id
export const updateMember = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params;
    const member: Member = req.body;

    // Filter out undefined fields
    const fieldsToUpdate = (Object.keys(member) as (keyof Member)[]).filter((key) => member[key] !== undefined);
    const valuesToUpdate = fieldsToUpdate.map((key) => member[key]);
    const setClause = fieldsToUpdate.map((key) => `${String(key)} = ?`).join(', ');

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }

    const query = `UPDATE member SET ${setClause} WHERE member_id = ?`;

    db.query(query, [...valuesToUpdate, member_id], (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        return res.status(200).json({ success: true, message: 'Member updated successfully' });
    });
};

// delete member
export const deleteMember = (req: Request, res: Response, next: NextFunction) => {
    const { member_id } = req.params;

    const query = 'DELETE FROM member WHERE member_id = ?';
    const values = [member_id];

    db.query(query, values, (err: any, result: any) => {
        if (err) return res.status(500).json({ success: false, message: err.sqlMessage });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        return res.status(200).json({ success: true, message: 'Member deleted successfully' });
    });
};

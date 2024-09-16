import { NextFunction, Request, Response } from 'express'
import { db } from '../utils/db'
import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send('working fine 👍')
}

// admin login
export const login = (req: Request, res: Response, next: NextFunction) => {
    const q = 'SELECT * FROM admin WHERE username = ?'
    const { username, password } = req.body

    if (!username || !password) {
        return res
            .status(400)
            .json({ success: false, message: 'Please enter both username and password.' })
    }

    db.query(q, [username], (err: any, data: any) => {
        const user = data[0]

        if (err) return res.status(500).json({ success: false, message: err.sqlMessage })

        if (data.length === 0)
            return res.status(404).json({ success: false, message: 'User not found!' })

        if (password !== user.password) {
            return res.status(400).json({ success: false, message: 'Wrong password or username!' })
        }

        const jwtSecret = process.env.JWT_SECRETE as string
        const token = jwt.sign({ id: user.id }, jwtSecret)

        return res
            .cookie('accessToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({ success: true, user })
    })
}

// logout
export const logout = (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })
        .status(200)
        .json({ success: true, message: 'User has been logged out.' })
}

// isLogin
export const isLogin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
    const jwtSecret = process.env.JWT_SECRETE as string
    const decoded = jwt.verify(token, jwtSecret)
    const payload = decoded as JwtPayload

    db.query('SELECT * FROM admin where id = ?', [payload.id], (err, data: any) => {
        res.status(200).json({ success: true, message: 'User is logged in!', user: data[0] })
    })
}

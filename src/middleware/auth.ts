import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
    if (!token) return res.status(401).json({ success: false, message: 'Please login!' })

    const jwtSecret = process.env.JWT_SECRETE as string
    jwt.verify(token, jwtSecret, (err: any, userInfo: any) => {
        if (err) return res.status(403).json({ success: false, message: 'Token is not valid!' })
        // req.userInfo = userInfo;
        next()
    })
}

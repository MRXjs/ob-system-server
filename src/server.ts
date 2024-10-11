import 'dotenv/config'
import express from 'express'
import adminRouter from './routes/admin.route'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import memberRouter from './routes/member.route'
import meetingRouter from './routes/meeting.route'
import membershipFeeRoute from './routes/membershipFee.route'
import eventRouter from './routes/event.route'
import meetingInvolveRoute from './routes/meetingInvolve.route'
import paidMemberRoute from './routes/paidMember.route'
import eventContributeRoute from './routes/eventContribute.route'
import path from 'path'

const app = express()

// cors
app.use(
    cors({
        origin: process.env.LOCAL_ORIGIN,
        credentials: true,
    }),
)

// body parser
app.use(express.json({ limit: '50mb' }))

// cookie parser
app.use(cookieParser())

// Serve static files from the 'public' directory
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')))

// routes
app.use(
    '/api/v1',
    adminRouter,
    memberRouter,
    meetingRouter,
    membershipFeeRoute,
    eventRouter,
    meetingInvolveRoute,
    paidMemberRoute,
    eventContributeRoute,
)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

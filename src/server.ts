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

const app = express()

// body parser
app.use(express.json({ limit: '50mb' }))

// cors
app.use(
    cors({
        origin: process.env.LOCAL_ORIGIN,
        credentials: true,
    }),
)

// cookie parser
app.use(cookieParser())

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

const port = 5000 || process.env.PORT

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

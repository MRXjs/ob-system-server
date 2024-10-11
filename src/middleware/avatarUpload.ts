import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

// Ensure the upload directory exists
const avatarDir = path.join(__dirname, '../../public/avatars')
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true })
}

// Set up multer to save uploaded images in the 'public/avatars' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, avatarDir)
    },
    filename: function (req, file, cb) {
        if (file && file.originalname) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
            const fileExt = path.extname(file.originalname)
            const finalFileName = file.fieldname + '-' + uniqueSuffix + fileExt
            const filePath = path.join(avatarDir, finalFileName)

            // Return the filename if no error
            cb(null, finalFileName)
        } else {
            // Generate a random filename if file.originalname is not provided
            const randomFileName = crypto.randomBytes(16).toString('hex')

            // Return the random filename
            cb(null, randomFileName)
        }
    },
})

// Only allow image files
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed!'), false)
    }
}

export const avatarUpload = multer({ storage, fileFilter })

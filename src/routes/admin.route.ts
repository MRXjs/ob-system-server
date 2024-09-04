import express from 'express';
import { login, logout, test } from '../controllers/admin.controller';

const adminRouter = express.Router();

adminRouter.get('/test', test);
adminRouter.post('/login', login);
adminRouter.get('/logout', logout);

export default adminRouter;

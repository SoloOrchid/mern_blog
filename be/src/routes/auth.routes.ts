import express, {Router} from "express";
import {register, login, logout } from '../controllers/auth.controller';

import cors from 'cors'
import verifyToken from "../middleware/auth.middleware";

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(verifyToken)
router.post('/logout', logout);

export default router;
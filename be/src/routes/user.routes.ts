import express, {Router} from "express";
import verifyToken from "../middleware/auth.middleware";
import {authProfile, show, update, destroy} from '../controllers/user.controller';

const router: Router = express.Router();

router.get('/:id', show);

router.use(verifyToken)
router.get('/', authProfile);
router.post('/', update);
router.post('/destroy', destroy);


export default router;
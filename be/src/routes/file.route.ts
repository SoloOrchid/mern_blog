import express, {Router} from 'express';
import {show} from '../controllers/file.controller';

const router: Router = express.Router();


router.get('/:file', show)

export default router;
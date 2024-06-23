import express from 'express';
import * as Posts from '../controllers/posts.controller';
import verifyToken from '../middleware/auth.middleware';
import { MulterRequest } from '../middleware/upload'; // Ensure correct import
import upload from '../middleware/upload'; // Ensure correct import

const router = express.Router();

router.get('/', Posts.index);
router.get('/search/:query', Posts.search);
router.get('/:username', Posts.getByUser);
router.get('/:username/:slug', Posts.show);

router.use(verifyToken);

// @ts-ignore
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), Posts.create as (req: MulterRequest, res: express.Response) => void);
router.get('/:username/:slug/like/', Posts.like);
router.get('/:username/:slug/liked/', Posts.liked);
router.put('/:username/:slug', Posts.update);
router.delete('/:username/:slug', Posts.destroy);

export default router;

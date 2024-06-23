import express, {Router} from "express";
import { getByPost, create, update, destroy } from "../controllers/comment.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:username/:slug", getByPost);

router.use(verifyToken)
router.post("/:username/:slug", create);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
import express, {Router} from "express";
import { index, create, update, destroy} from "../controllers/category.controller";

import verifyToken from "../middleware/auth.middleware";
const router: Router = express.Router();

router.get("/", index);

router.use(verifyToken)
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
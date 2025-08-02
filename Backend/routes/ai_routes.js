import { Router } from "express";
const router = Router();

import * as aiController from "../controllers/ai_controller.js";

router.get("/get-result", aiController.generateResult)


export default router;
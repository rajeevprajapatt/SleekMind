import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import * as authMiddleware from '../middleware/auth_middleware.js';
import * as chatsController from '../controllers/chatMessage-controller.js';

const router = Router();

router.get("/:projectId",
    authMiddleware.authUser,
    chatsController.getAllChatMessages
)

export default router;
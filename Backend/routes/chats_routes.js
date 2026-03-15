import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import * as authMiddleware from '../middleware/auth_middleware.js';
import * as chatsController from '../controllers/chatMessage-controller.js';

const router = Router();



router.get("/getFileTree/:projectId",
    authMiddleware.authUser,
    chatsController.getFileTree
)

router.get("/getMessage",
    authMiddleware.authUser,
    // console.log("Received request for getMessage with fileId:", req.params.fileId),
    // (req,res,next) => {
    //     console.log("Received request for getMessage with fileId:", req.body.fileId);
    //     next();
    // },
    chatsController.getMessage
)

router.put("/UpdateMessage",
    authMiddleware.authUser,
    chatsController.getMessage
)

router.get("/:projectId",
    authMiddleware.authUser,
    chatsController.getAllChatMessages
)

export default router;
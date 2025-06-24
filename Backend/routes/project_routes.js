import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import * as projectController from '../controllers/project-controller.js';
import * as authMiddleware from '../middleware/auth_middleware.js';

const router = Router();

// Middleware to handle validation errors
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post(
    "/create",
    authMiddleware.authUser,
    body("name").isString().withMessage("Name is required"),
    handleValidation,
    projectController.createProject
);

export default router;
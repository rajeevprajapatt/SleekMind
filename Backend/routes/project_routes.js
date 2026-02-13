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

router.get("/all",
    authMiddleware.authUser,
    projectController.getAllProject
);

router.put("/addUser",
    authMiddleware.authUser,
    body("projectId").isString().withMessage("ProjectId must be a string"),
    body("users")
        .isArray({ min: 1 }).withMessage("Users must be a non-empty array")
        .custom((arr) => arr.every(u => typeof u === "string")).withMessage("Each user must be a string"),
    handleValidation,

    projectController.addUserToProject
)

router.get("/getProject/:projectId",
    authMiddleware.authUser,
    projectController.getProjectById
)

router.delete("/deleteProject/:projectId",
    authMiddleware.authUser,
    projectController.deleteProject
)


export default router;
import {Router} from "express";
import * as userController from "../controllers/user_controller.js";
import { body } from "express-validator";

const router = Router();

router.post("/register",
    body("email").isEmail().withMessage("Email must be a valid email"),
    body("password").isLength({ min: 3 }).withMessage("password should be at most 3 characters long"),
    userController.createUserController
);

router.post("/login",
    body("email").isEmail().withMessage("Email must be a valid email"),
    body("password").isLength({ min: 3 }).withMessage("password should be at most 3 characters long"),
    userController.loginUserController
)

export default router;
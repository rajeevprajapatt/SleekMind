import { Router } from "express";
import * as userController from "../controllers/user_controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth_middleware.js";

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

router.get("/test",(req,res)=>{
    res.send("User route is working")
})

router.get("/profile", authMiddleware.authUser, userController.profileUserController);

router.get("/logout",authMiddleware.authUser,userController.logoutUserController);

router.get("/all",
    authMiddleware.authUser,
    userController.getAllUsersController
)

export default router;
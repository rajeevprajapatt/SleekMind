import User from "../models/user.js";
import * as userService from "../services/user_services.js";
import { validationResult } from "express-validator";

export const createUserController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJwt();
        res.status(200).json({user, token});
    } catch (error) {
        res.status(400).send(error.message)
    }
}
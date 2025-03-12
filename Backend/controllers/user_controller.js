import User from "../models/user.js";
import * as userService from "../services/user_services.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const createUserController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await userService.createUser(req.body);

        const token = await user.generateJwt();
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const { email, password } = req.body;
        console.log(password);

        const user = await User.findOne({ email }).select('+password');
        console.log(user);
        if (!user) {
            res.status(401).json({ error: "Invalid credential" });
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            res.status(401).json({ error: "Invalid Password" });
        }

        const token = await user.generateJwt();
        return res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const profileUserController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).send({ error: "User not found" });
    }
}
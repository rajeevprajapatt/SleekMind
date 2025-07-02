import User from "../models/user.js";
import * as userService from "../services/user_services.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import redisClient from "../services/redis_service.js";

export const createUserController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await userService.createUser(req.body);

        const token = await user.generateJwt();
        // Remove password from the response
        delete user._doc.password;
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
        delete user._doc.password; // Remove password from the response
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

export const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        await redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);
        res.status(200).send({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Logout failed" });
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        const loggedInUser = await User.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: err.message })
    }
}
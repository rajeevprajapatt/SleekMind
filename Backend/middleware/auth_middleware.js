import jwt from "jsonwebtoken";
import redisClient from "../services/redis_service.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized User" });
        }

        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            res.cookie("token","");
            return res.status(401).json({ error: "Redis unauthorized User" });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized User" });
    }
}
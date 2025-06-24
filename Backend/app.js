import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import connect from "./database/db.js";
import dotenv from "dotenv/config";
import userRoutes from "./routes/user_routes.js"
import projectRouter from './routes/project_routes.js';
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
connect();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
    return res.json({ msg: "Hello World" });
})
app.use("/users", userRoutes);
app.use("/projects", projectRouter);


export default app;
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import connect from "./database/db.js";
import dotenv from "dotenv/config";
import userRoutes from "./routes/user_routes.js"
import projectRouter from './routes/project_routes.js';
import chatRouter from './routes/chats_routes.js'
import aiRouter from './routes/ai_routes.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import ImageKit from "imagekit";

const app = express();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(cors());
const allowedOrigins = [
  "https://sleekmind.vercel.app",
  "https://sleekmind-kfrkwn6ol-rajeevprajapat43-gmailcoms-projects.vercel.app"  // Vercel preview URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("*", cors());




 

app.get("/", (req, res) => {
    return res.json({ msg: "Hello World" });
})
app.get("/ping", (req, res) => res.send("Server is alive"));

app.use("/users", userRoutes);
app.use("/projects", projectRouter);
app.use("/chats",chatRouter);
app.use("/ai", aiRouter);


const imagekit = new ImageKit({
  urlEndpoint: process.env.URL_ENDPOINT, 
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

app.get("/imagekitAuth", (req, res) => {
  const {token,expire, signature} = imagekit.getAuthenticationParameters();
  return res.send({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
});

export default app;
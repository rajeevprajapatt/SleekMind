import http from "http";
import app from "./app.js";
import dotenv from "dotenv/config";
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import projectModel from './models/project-model.js';
import User from "./models/user.js";
import ChatMessage from "./models/chat-message.js";
import { generateResult } from "./services/ai_service.js";

const Port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://sleekmind.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization"]
  },
  transports: ["websocket", "polling"],
});


io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'))
        }

        socket.project = await projectModel.findById(projectId);


        if (!token) {
            return next(new Error('Authorization error'));
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {
            return next(new Error('Authorization error'));
        }

        socket.user = decoded;

        next();
    } catch (error) {
        next(error)
    }
})

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();

    console.log("a user connected");

    socket.join(socket.roomId);

    socket.on('project-message', async (data) => {
        const { message, sender, projectId } = data;
        let user = await User.findById(sender);
        const UserMessage = await ChatMessage.create({
            projectId,
            sender: user,
            message: {
                text: message
            }
        })
        io.to(socket.roomId).emit('project-message', UserMessage);

        const isAI = message.includes('@ai');
        if (isAI) {
            const AIindex = message.indexOf('@ai');
            const prompt = message.substr(AIindex + 3, message.length).trim();
            const result = await generateResult(prompt);
            // console.log(JSON.parse(result));

            const AI_USER_ID = "000000000000000000000001";
            user = await User.findById(AI_USER_ID);

            const AIresponse = await ChatMessage.create({
                projectId,
                sender: user,
                message: JSON.parse(result)
            })
            io.to(socket.roomId).emit('project-message', AIresponse);
        }
        console.log("message sent");
    })

    socket.on('disconnect', () => {
        console.log("a user disconnected");
        socket.leave(socket.roomId);
    });
})

server.listen(Port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
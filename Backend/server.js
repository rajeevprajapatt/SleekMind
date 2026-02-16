import dotenv from "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import projectModel from './models/project-model.js';
import User from "./models/user.js";
import ChatMessage from "./models/chat-message.js";
import { generateResult } from "./services/ai_service.js";
import { text } from "stream/consumers";

const Port = process.env.PORT || 3000;

const allowedOrigins = [
    "https://sleekmind.vercel.app",
    "https://sleekmind-kfrkwn6ol-rajeevprajapat43-gmailcoms-projects.vercel.app"  // Vercel preview URL
];
// const allowedOrigins = [
//   "http://localhost:5173",  // Vite frontend
//   "http://localhost:3000",  // CRA or Next.js local
//   "http://127.0.0.1:5173",
//   "http://127.0.0.1:3000"
// ];

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
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

            let parsedResult;

            try {
                parsedResult = JSON.parse(result);
            } catch (err) {
                parsedResult = { text: result }
            }

            function normaliseFileTree(fileTree, parentPath = "") {
                let files = [];

                for (const key in fileTree) {
                    const value = fileTree[key];
                    const currentPath = parentPath ? `${parentPath}/${key}` : key;

                    if (value && typeof value === "object" &&
                        value.hasOwnProperty("content")
                    ) {
                        files.push({
                            name: key,
                            path: currentPath,
                            content: value.content,
                            type: "file"
                        })
                    } else if (typeof value === "object") {
                        files.push({
                            name: key,
                            path: currentPath,
                            type: "folder"
                        });

                        files = files.concat(
                            normaliseFileTree(value, currentPath)
                        )
                    }
                }

                return files;
            }

            let normalizedMessage = {
                text: parsedResult.text || "",
            };

            if (parsedResult.fileTree) {
                normalizedMessage.files = normaliseFileTree(parsedResult.fileTree);
                normalizedMessage.folderName = parsedResult["folder-name"] || "AI_Files";
                normalizedMessage.buildCommand = parsedResult.generationConfig?.buildCommand || null;
                normalizedMessage.startCommand = parsedResult.generationConfig?.startCommand || null;
            }

            const AIresponse = await ChatMessage.create({
                projectId,
                sender: user._id,
                message: normalizedMessage
            })
            console.log("AI response created:", AIresponse);
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
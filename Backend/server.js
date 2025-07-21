import http from "http";
import app from "./app.js";
import dotenv from "dotenv/config";
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import projectModel from './models/project-model.js'


const Port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
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

    console.log("a user connected");

    socket.join(socket.project._id);

    socket.on('project-message', data => {
        console.log(data)
        socket.broadcast.to(socket.project._id).emit('project-message', data)
    })

    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { /* … */ });
})

server.listen(Port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
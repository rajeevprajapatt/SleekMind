import http from "http";
import app from "./app.js";
import dotenv from "dotenv/config";
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'


const Port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

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
    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { /* … */ });
})

server.listen(Port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
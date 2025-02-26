import http from "http";
import app from "./app.js";
import dotenv from "dotenv/config";


const Port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(Port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
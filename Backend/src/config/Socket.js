import express from 'express';
import http from "http"
import { Server } from 'socket.io';
import { socketAuthMiddlewear } from '../middlewear/socket.auth.middlewear.js';

const app = express()
const server = http.createServer(app)

const allowedorigin = [ process.env.CLIENT_URL, 'http://localhost:5173' , 'http://localhost:4173'].filter(Boolean)

const io = new Server(server, { cors: { origin: allowedorigin, credentials: true } })

const userSocketMap = {}

io.use(socketAuthMiddlewear)

export function getReciverSocketID(userID) {
    return userSocketMap[userID]
    if (!userSocketMap[userID]) return [];
    return Array.from(userSocketMap[userID]);
}

io.on("connection" , (socket)=>{
    const userID = socket.userID
    socket.join(userID.toString());

    if (!userSocketMap[userID]) {
        userSocketMap[userID] = new Set();
    }
    userSocketMap[userID].add(socket.id);

    io.emit("getOnlineUsers" , Object.keys(userSocketMap))
    
    socket.on("disconnect" , ()=>{
        if (userSocketMap[userID]) {
            userSocketMap[userID].delete(socket.id);
            if (userSocketMap[userID].size === 0) {
                delete userSocketMap[userID];
            }
        }
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))
    })
})

export { io, app, server }
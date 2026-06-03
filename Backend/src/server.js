import express from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser"
import authRouter from "./Routes/Auth.Routes.js";
import messageRouter from "./Routes/Message.Routes.js"
import connectdb from "./config/mongodb.js";
import cors from "cors"
import { app , server } from "./config/Socket.js";

app.use(express.json({limit:"5mb"}));

const port = process.env.PORT || 4000;
connectdb();

const allowedorigin = [process.env.CLIENT_URL , 'http://localhost:5173' , 'http://localhost:4173'].filter(Boolean)

app.use(cookieParser());
app.use(cors({ origin : allowedorigin , credentials: true }));

app.use("/auth" , authRouter)
app.use("/message" , messageRouter)

server.listen(port, () => { console.log(`Server is runing on the Port : ${port}`) })
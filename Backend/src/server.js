import express from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser"
import authRouter from "./Routes/authrote.js";
import connectdb from "./config/mongodb.js";

const app = express()
app.use(express.json());

const port = process.env.port || 4000;
connectdb();

app.use(cookieParser());

app.use("/auth" , authRouter)

app.listen(port, () => { console.log(`Server is runing on the Port : ${port}`) })
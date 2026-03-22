import express from "express";
import 'dotenv/config';
import authRouter from "./Routes/authrote.js";

const app = express()
const port = process.env.port || 4000;

app.use("/auth" , authRouter)

app.listen(port, () => { console.log(`Server is runing on the Port : ${port}`) })
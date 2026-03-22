import express from "express";
import { login } from "../controller/authcontroller.js";
const authRouter = express.Router()

authRouter.get("/login" , login)

export default authRouter
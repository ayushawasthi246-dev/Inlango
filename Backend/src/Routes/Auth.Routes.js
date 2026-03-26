import express from "express";
import { login, logout, refreshAccessToken, register, resendResetPassLink, resendVerification, resetPass, resetPassLink, uplodProfilePic, verification } from "../controller/authcontroller.js";
import { userauth } from "../middlewear/auth.js";
import { arcjetProtection } from "../middlewear/arcjet.middlewear.js";
const authRouter = express.Router()

// authRouter.use(arcjetProtection)

authRouter.post("/register" , register)
authRouter.post("/verification" , verification)
authRouter.post("/resendVerification" , resendVerification)
authRouter.post("/login" , login)
authRouter.post("/logout" , logout)
authRouter.post("/refreshAccessToken" , refreshAccessToken)
authRouter.post("/resetPassLink" , resetPassLink)
authRouter.post("/resendResetPassLink" , resendResetPassLink)
authRouter.put("/resetPass" , resetPass)

authRouter.put("/uplodProfilePic" , userauth , uplodProfilePic)
authRouter.get("/checkAuth" , userauth , (req,res) => res.status(200).json(req.user))

export default authRouter
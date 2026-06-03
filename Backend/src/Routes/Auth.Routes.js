import express from "express";
import { login, logout, refreshAccessToken, register, resendResetPassLink, resendVerification, resetPass, resetPassLink, uplodProfile, uplodProfilePic, verification, googleLogin, markTranslationDisclaimerSeen } from "../controller/authcontroller.js";
import { userauth } from "../middlewear/auth.js";
import { arcjetProtection } from "../middlewear/arcjet.middlewear.js";
const authRouter = express.Router()

authRouter.use(arcjetProtection)

authRouter.post("/register", register)
authRouter.post("/verification/:token", verification)
authRouter.get("/resendVerification/:token", resendVerification)
authRouter.post("/loginWithGoogle", googleLogin)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/resetPassLink", resetPassLink)
authRouter.post("/resendResetPassLink", resendResetPassLink)
authRouter.put("/resetPass/:token", resetPass)

authRouter.put("/uplodProfilePic", userauth, uplodProfilePic)
authRouter.put("/uplodProfile", userauth, uplodProfile)
authRouter.patch("/translation-disclaimer-seen", userauth, markTranslationDisclaimerSeen)

authRouter.get("/refreshAccessToken", refreshAccessToken)
authRouter.get("/checkAuth", userauth, (req, res) => res.status(200).json({ success: true, message: "Already logged in", userData: req.user }))

export default authRouter
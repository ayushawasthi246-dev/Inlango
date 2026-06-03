import jwt from "jsonwebtoken"
import UserModel from "../models/user.js"

export const userauth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ success: false, message: "No token provided" })
    }

    const accessToken = authHeader.split(" ")[1]

    if (!accessToken) {
        return res.status(401).json({ success: false, message: "Not authorized . Please log in again" })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.Access_SECRET)
        if (!decoded) return res.status(401).json({ success: false, message: "Not authorized . Please log in again" })

        const user = await UserModel.findById(decoded.id).select("Username Email ProfilePic Language createdAt translationDisclaimerSeen")
        if (!user) return res.status(404).json({ success: false, message: "user not exists" })

        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" })
    }
}
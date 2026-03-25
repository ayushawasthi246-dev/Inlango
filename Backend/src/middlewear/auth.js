import jwt from "jsonwebtoken"
import UserModel from "../models/user.js"

export const userauth = async (req, res , next) => {

    const { refreshToken } = req.cookies

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Not authorized . Please log in again" })
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.Refresh_SECRET)
        if (!decoded) return res.status(401).json({ success: false, message: "Not authorized . Please log in again" })

        const user = await UserModel.findById(decoded.id).select("Username Email ProfilePic")
        if(!user) return res.status(404).json({success: false, message: "user not exists"})

        req.user = user
        next()

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
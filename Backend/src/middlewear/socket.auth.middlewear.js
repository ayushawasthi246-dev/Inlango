import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

export const socketAuthMiddlewear = async (socket, next) => {

    try {
        const token = socket.handshake.auth.accessToken
        if (!token) return next(new Error("Unauthorized - Token missing"))
        
        const decoded = jwt.verify(token, process.env.Access_SECRET)
        if (!decoded) return next(new Error("Unauthorized - Invalid token"))
            
            const user = await UserModel.findById(decoded.id).select("-Password")
            if (!user) return next(new Error("User not Found"))
            
            socket.user = user
            socket.userID = user._id
        next();

    } catch (error) {
        next(new Error("Unauthorized - Auth failed"));
    }
}
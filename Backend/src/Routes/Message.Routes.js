import express from "express"
import { arcjetProtection } from "../middlewear/arcjet.middlewear.js"
import { userauth } from "../middlewear/auth.js"
import { getAllUsers, getChatPartner, getMsssagesFromID, sendMessage, deleteMessage, getMediaFromID } from "../controller/message.controller.js"
const messageRouter = express.Router()

messageRouter.use(arcjetProtection, userauth)

messageRouter.get("/allUsers", getAllUsers)
messageRouter.get("/chats", getChatPartner)
messageRouter.get("/media", getMediaFromID)
messageRouter.get("/:id", getMsssagesFromID)
messageRouter.post("/send/:id", sendMessage)
messageRouter.delete("/delete/:id", deleteMessage)
export default messageRouter
import express from "express"
import { arcjetProtection } from "../middlewear/arcjet.middlewear.js"
import { userauth } from "../middlewear/auth.js"
import { getAllContacts, getChatPartner, getMsssagesFromID, sendMessage } from "../controller/message.controller.js"
const messageRouter = express.Router()

messageRouter.use(arcjetProtection,userauth)

messageRouter.get("/contacts" , getAllContacts)
messageRouter.get("/chats" ,getChatPartner)
messageRouter.get("/:id" ,getMsssagesFromID)
messageRouter.post("/send/:id" ,sendMessage )

export default messageRouter
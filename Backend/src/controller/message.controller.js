import { set } from "mongoose"
import cloudinary from "../config/couldinary.js"
import messageModel from "../models/message.js"
import UserModel from "../models/user.js"

export const getAllContacts = async (req, res) => {
    const loggedUserID = req.user._id
    if (!loggedUserID) return res.status(400).json({ sucess: false, message: "please try again" })

    try {
        const filterUsers = await UserModel.find({ _id: { $ne: loggedUserID } }).select("Username ProfilePic")

        if (filterUsers.length === 0) return res.status(200).json({ sucess: true, message: "No user Present" })

        return res.status(200).json(filterUsers)
    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getChatPartner = async (req, res) => {
    const loggedUserID = req.user._id
    if (!loggedUserID) {
        return res.status(400).json({ sucess: false, message: "please try again" })
    }
    try {
        const messages = await messageModel.find({
            $or: [{SenderID: loggedUserID} , {ReceiverID: loggedUserID}]
        })

        const chatPartnerIds = [
            ...new Set (
                messages.map((msg)=>
                    msg.SenderID.toString() === loggedUserID.toString() ? msg.ReceiverID.toString() : msg.SenderID.toString()
                )
            )
        ]
        const chatPartner = await UserModel.find({_id : {$in : chatPartnerIds}}).select("Username ProfilePic")

        return res.status(200).json(chatPartner)

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getMsssagesFromID = async (req, res) => {
    const myID = req.user._id
    const { id: chartPartnerID } = req.params

    if (!myID || !chartPartnerID) {
        return res.status(400).json({ sucess: false, message: "please try again" })
    }
    try {
        const messages = await messageModel.find({
            $or: [
                { SenderID: myID, ReceiverID: chartPartnerID },
                { SenderID: chartPartnerID, ReceiverID: myID }
            ]
        })

        if (messages.length === 0) return res.status(200).json({ sucess: true, message: "No Messages" })

        return res.status(200).json(messages)

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    const SenderID = req.user._id
    const { id: ReceiverID } = req.params
    const { Text, Image } = req.body

    if (!SenderID || !ReceiverID) {
        return res.status(400).json({ sucess: false, message: "please try again" })
    }

    if (!Text && !Image) return res.status(400).json({ success: false, message: "Cannot send an empty message" })

    if (ReceiverID.toString() === SenderID.toString()) return res.status(400).json({ success: false, message: "Cannot send an empty message" })

    const receiver = await UserModel.exists({_id: ReceiverID})
    if(!receiver) return res.status(404).json({ success: false, message: "Receiver not found" })

    try {
        let imageURL
        if (Image) {
            const uploadResponse = await cloudinary.uploader.upload(Image)
            imageURL = uploadResponse.secure_url
        }

        const newMessage = new messageModel({ SenderID, ReceiverID, Text, Image: imageURL })
        await newMessage.save()

        //stocket.io !!!!!!!!!

        return res.status(200).json(newMessage)

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

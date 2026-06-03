import cloudinary from "../config/cloudinary.js"
import { io } from "../config/Socket.js"
import messageModel from "../models/message.js"
import UserModel from "../models/user.js"
import { getReciverSocketID } from "../config/Socket.js"
import { translateMsg } from "../config/translate.js"

export const getAllUsers = async (req, res) => {

    const loggedUserID = req.user._id
    if (!loggedUserID) return res.status(400).json({ success: false, message: "please try again" })

    try {
        const filterUsers = await UserModel.find({ _id: { $ne: loggedUserID } }).select("Username ProfilePic")

        if (filterUsers.length === 0) return res.status(200).json({ success: true, message: "No user Present" })

        return res.status(200).json({ success: true, allUsers: filterUsers })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getChatPartner = async (req, res) => {

    const loggedUserID = req.user._id
    if (!loggedUserID) {
        return res.status(400).json({ success: false, message: "please try again" })
    }
    try {
        const messages = await messageModel.find({
            $or: [{ SenderID: loggedUserID }, { ReceiverID: loggedUserID }]
        })

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.SenderID.toString() === loggedUserID.toString() ? msg.ReceiverID.toString() : msg.SenderID.toString()
                )
            )
        ]
        const chatPartner = await UserModel.find({ _id: { $in: chatPartnerIds } }).select("Username ProfilePic")

        return res.status(200).json({ success: true, chatPartner: chatPartner })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getMsssagesFromID = async (req, res) => {

    const myID = req.user._id
    const { id: chatPartnerID } = req.params

    if (!myID || !chatPartnerID) {
        return res.status(400).json({ success: false, message: "please try again" })
    }
    try {
        const messages = await messageModel.find({
            $or: [
                { SenderID: myID, ReceiverID: chatPartnerID },
                { SenderID: chatPartnerID, ReceiverID: myID }
            ]
        })
        return res.status(200).json({ success: true, chatMessages: messages })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const deleteMessage = async (req, res) => {
    const myID = req.user._id
    const { id: messageId } = req.params
    if (!myID || !messageId) {
        return res.status(400).json({ success: false, message: "Please try again" })
    }

    try {
        const message = await messageModel.findById(messageId)
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" })
        }
        if (message.SenderID.toString() !== myID.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this message" })
        }
        if (message.Image) {
            try {
                const publicId = message.Image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryErr) {
                return res.status(500).json({ success: false, message: "Failed to delete image from Cloudinary" })
            }
        }

        await messageModel.findByIdAndDelete(messageId)

        io.to(message.ReceiverID.toString()).emit("messageDeleted", messageId);
        io.to(myID.toString()).emit("messageDeleted", messageId);

        return res.status(200).json({ success: true, message: "Message deleted successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    const myID = req.user._id
    const { id: chatPartnerID } = req.params
    const { Text, Image, translation } = req.body


    if (!myID || !chatPartnerID) {
        return res.status(400).json({ success: false, message: "please try again" })
    }

    if (!Text && !Image) return res.status(400).json({ success: false, message: "Cannot send an empty message" })

    if (chatPartnerID.toString() === myID.toString()) return res.status(400).json({ success: false, message: "Cannot send Message to yourself" })

    const ReceiverUser = await UserModel.findById(chatPartnerID)
    if (!ReceiverUser) return res.status(404).json({ success: false, message: "Receiver not found" })

    const messageHistory = await messageModel.find({
        $or: [
            { SenderID: myID, ReceiverID: chatPartnerID },
            { SenderID: chatPartnerID, ReceiverID: myID }
        ]
    }).sort({ createdAt: -1 }).limit(5).select("Text SenderID -_id")

    const formattedMessage = messageHistory.map((msg) => ({
        role: msg.SenderID.equals(myID) ? "user" : "assistant",
        message: msg.Text
    }))

    const receiverLang = ReceiverUser.Language

    try {
        let imageURL
        let translatedResult

        if (Image) {
            const uploadResponse = await cloudinary.uploader.upload(Image)
            imageURL = uploadResponse.secure_url
        }

        if (translation) {
            translatedResult = await translateMsg(Text, formattedMessage, receiverLang)
        }

        const newMessage = new messageModel({
            SenderID: myID,
            ReceiverID: chatPartnerID,
            Text,
            Image: imageURL
        })

        if (translation && translatedResult) {
            newMessage.TranslatedText = translatedResult;
        }
        await newMessage.save()

        io.to(chatPartnerID.toString()).emit("newMessage", newMessage);

        return res.status(200).json({ success: true, NewMessage: newMessage })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getMediaFromID = async (req, res) => {
    const myID = req.user._id

    if (!myID) {
        return res.status(400).json({ success: false, message: "please try again" })
    }
    try {
        const Images = await messageModel.find({
            $or: [
                { SenderID: myID, Image: { $exists: true, $ne: null } },
                { ReceiverID: myID, Image: { $exists: true, $ne: null } }
            ]
        }).select("-updatedAt -Text -Seen")

        return res.status(200).json({ success: true, media: Images })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
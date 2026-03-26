import Mongoose from "mongoose";

const messageschema = Mongoose.Schema({
    SenderID: { type: Mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ReceiverID: { type: Mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Text: { type: String, trim: true, maxlength: 2000 },
    Image: { type: String },
    Seen: { type: Boolean, default: false },
}, { timestamps: true })

const messageModel = Mongoose.models.Message || Mongoose.model('Message', messageschema)
export default messageModel 
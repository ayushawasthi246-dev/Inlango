import Mongoose from "mongoose";

const userschema = Mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true, trim: true },
    Password: { type: String, default: null },
    Language: { type: String, default: 'English' },
    ProfilePic: { type: String, default: '' },
    VerifyCode: { type: String, default: '' },
    VerifyCodeToken: { type: String, default: '' },
    VerifyCodeExpireAt: { type: Number, default: 0 },
    VerifiedAccount: { type: Boolean, default: false },
    translationDisclaimerSeen: { type: Boolean, default: false },
    PasswordRestToken: { type: String, default: '' },
    PasswordRestTokenExpireAt: { type: Number, default: 0 },
    PasswordRestRequestedAt: { type: Number, default: 0 },
    Refresh_Token: { type: String, default: null },
    GoogleId: { type: String, default: null },
}, { timestamps: true })

const UserModel = Mongoose.models.User || Mongoose.model('User', userschema)
export default UserModel 
import Mongoose from "mongoose";

const userschema = Mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    ProfilePic: { type: String, default: '' },
    VerifyCode: { type: String, default: '' },
    VerifyCodeExpireAt: { type: Number, default: 0 },
    VerifiedAccount: { type: Boolean, default: false },
    PasswordRestToken: { type: String, default: '' },
    PasswordRestTokenExpireAt: { type: Number, default: 0 },
})

const UserModel = Mongoose.models.User || Mongoose.model('User', userschema)
export default UserModel 
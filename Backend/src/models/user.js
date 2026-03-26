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
<<<<<<< HEAD
},{timestamp:true})
=======
})
>>>>>>> b0510c114b270ccd25873bfccd4b0054861698cd

const UserModel = Mongoose.models.User || Mongoose.model('User', userschema)
export default UserModel 
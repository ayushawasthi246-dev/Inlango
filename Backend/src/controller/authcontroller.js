import UserModel from "../models/user.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { RestPassLink, SendOTP, Welcome } from "../utils/Mail.js";
import { genrateAcessToken, genrateRefreshToken } from "../utils/token.js";
import cloudinary from "../config/couldinary.js";

export const register = async (req, res) => {

    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
        return res.status(400).json({ sucess: false, message: "Missing Data" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ sucess: false, message: "Invalid email format" });
        }

        if (Password.length < 8) {
            return res.status(400).json({ sucess: false, message: "Password must be at least 8 chracters" })
        }

        let user = await UserModel.findOne({ Email })

        if (user && user.VerifiedAccount) {
            return res.status(400).json({ sucess: false, message: "User already exists" })
        }

        const HashPass = await bcrypt.hash(Password, 10)

        if (user) {
            user.Username = Username
            user.Email = Email
            user.Password = HashPass

            if (user.VerifyCodeExpireAt && user.VerifyCodeExpireAt > Date.now()) {
                return res.status(200).json({ success: true, message: "Same OTP is valid for 5 min " })
            }
        } else {
            user = new UserModel({ Username, Email, Password: HashPass })
        }

        const otp = String(Math.floor(Math.random() * 900000 + 100000))

        user.VerifyCode = otp
        user.VerifyCodeExpireAt = Date.now() + 5 * 60 * 1000

        await user.save()

        SendOTP({ Email: user.Email, otp })

        return res.status(200).json({ success: true, message: "Verification OTP has been sent to your email" });

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const verification = async (req, res) => {

    const { Email, otp } = req.body

    if (!Email || !otp) {
        return res.status(400).json({ success: false, message: "OTP is requried" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ sucess: false, message: "Invalid email format" });
        }

        const user = await UserModel.findOne({ Email })

        if (!user) {
            return res.status(404).json({ success: false, message: "something went wrong , please singup again" })
        }

        if (user.VerifiedAccount) {
            return res.status(404).json({ success: false, message: "user already verified" })
        }

        if (user.VerifyCode === "" || user.VerifyCode !== otp) {
            return res.status(400).json({ success: false, message: "Invalid Code" })
        }

        if (!user.VerifyCodeExpireAt || user.VerifyCodeExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has been Expired" })
        }

        user.VerifiedAccount = true
        user.VerifyCode = ""
        user.VerifyCodeExpireAt = 0
        await user.save()

        const accessToken = genrateAcessToken(user._id)
        genrateRefreshToken(user._id, res)

        Welcome(user)

        return res.status(201).json({ sucesss: "true", message: "Your email has been successfully verified and your account is now created", accessToken })


    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }

}

export const resendVerification = async (req, res) => {

    const { Email } = req.body

    if (!Email) {
        return res.status(400).json({ success: false, message: "Missing detail , Please register again" })
    }
    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ sucess: false, message: "Invalid email format" });
        }

        const ExistingUser = await UserModel.findOne({ Email })

        if (ExistingUser) {

            if (ExistingUser && ExistingUser.VerifiedAccount) {
                return res.status(400).json({ sucess: false, message: "User already exists" })
            }

            const otp = String(Math.floor(Math.random() * 900000 + 100000))

            ExistingUser.VerifyCode = otp
            ExistingUser.VerifyCodeExpireAt = Date.now() + 5 * 60 * 1000

            await ExistingUser.save()

            SendOTP({ Email: ExistingUser.Email, otp })

            return res.status(200).json({ success: true, message: "Verification OTP has been sent to your email" });

        } else {
            return res.status(400).json({ success: true, message: "User not exists , please register again" });
        }

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const login = async (req, res) => {

    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.json({ sucess: false, message: "Missing Data" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ sucess: false, message: "Invalid email format" });
        }

        if (Password.length < 8) {
            return res.status(400).json({ sucess: false, message: "Password must be at least 8 chracters" })
        }

        const ExistingUser = await UserModel.findOne({ Email })

        if (!ExistingUser) {
            return res.status(404).json({ sucess: false, message: "User not exists" })
        }

        if (ExistingUser && !ExistingUser.VerifiedAccount) {
            return res.status(404).json({ sucess: false, message: "User not exists" })
        }

        const isMatch = await bcrypt.compare(Password, ExistingUser.Password)

        if (!isMatch) {
            return res.status(400).json({ sucess: false, message: "Password is incorrect" })
        }

        const accessToken = genrateAcessToken(ExistingUser._id)
        genrateRefreshToken(ExistingUser._id, res)

        return res.status(200).json({ sucesss: "true", message: "logged In", accessToken })

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken");
        return res.status(200).json({ success: true, message: "User loged out" })
    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
        return res.status(401).json({ message: "Please login again" });
    }
    try {
        const decode = jwt.verify(refreshToken, process.env.Refresh_SECRET)
        const accessToken = jwt.sign({ id: decode.id }, process.env.Access_SECRET, { expiresIn: "15m" })
        res.json({ accessToken })
    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const resetPassLink = async (req, res) => {

    const { Email } = req.body

    if (!Email) {
        return res.status(400).json({ success: false, message: "Please Enter the Detail" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ sucess: false, message: "Invalid email format" });
        }

        const user = await UserModel.findOne({ Email })

        if (!user) {
            return res.status(400).json({ success: false, message: "user not exists" })
        }

        if (user.PasswordRestTokenExpireAt && user.PasswordRestTokenExpireAt > Date.now()) {
            return res.status(200).json({ success: true, message: "Same Password Reset link is valid for 10 min " })
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        RestPassLink({ user, token: resetToken })

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.PasswordRestToken = hashedToken;
        user.PasswordRestTokenExpireAt = Date.now() + 10 * 60 * 1000
        await user.save()

        return res.status(200).json({ success: true, message: "Reset Password link has been sent to your email" });

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const resendResetPassLink = async (req, res) => {

    const { Email } = req.body

    if (!Email) {
        return res.status(400).json({ success: false, message: "Please Enter the Detail" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ sucess: false, message: "Invalid email format" });
        }

        const user = await UserModel.findOne({ Email })

        if (!user) {
            return res.status(400).json({ success: false, message: "user not exists" })
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        RestPassLink({ user, token: resetToken })

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.PasswordRestToken = hashedToken;
        user.PasswordRestTokenExpireAt = Date.now() + 10 * 60 * 1000
        await user.save()

        return res.status(200).json({ success: true, message: "Reset Password link has been sent to your email" });

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const resetPass = async (req, res) => {
    const { token, newPass } = req.body;

    if (!token || !newPass) {
        return res.status(400).json({ success: false, message: "Please enter the Detail" })
    }

    try {

        if (newPass.length < 8) {
            return res.status(400).json({ sucess: false, message: "Password must be at least 8 chracters" })
        }

        const PasswordRestToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await UserModel.findOne({ PasswordRestToken })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not exists" })
        }

        if (!user.PasswordRestTokenExpireAt || user.PasswordRestTokenExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "This reset password link has been expired" })
        }

        const HashPass = await bcrypt.hash(newPass, 10)
        user.Password = HashPass
        user.PasswordRestToken = ""
        user.PasswordRestTokenExpireAt = 0
        await user.save()

        return res.status(201).json({ success: true, message: "Password has been changed" })

    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }

}

export const uplodProfilePic = async (req, res) => {

    const {profilePic} = req.body

    if(profilePic){
        return res.status(400).json({ success: false, message: "Please upload your profile photo" })
    }
    
    try {
        const userID = req.user._id

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updateUserData = await UserModel.findByIdAndUpdate(
            userID ,
            { ProfilePic : uploadResponse.secure_url },
            { new:true }
        )
        return res.status(200).json(updateUserData)
    } catch (error) {
        console.error("Error in register controller : ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
